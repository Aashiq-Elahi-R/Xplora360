import os
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.prompts import PromptTemplate
from langchain_together import Together
from langchain.memory import ConversationBufferWindowMemory
from langchain.chains import ConversationalRetrievalChain
from fastapi import FastAPI
from pydantic import BaseModel

# Load FAISS vector DB
embeddings = HuggingFaceEmbeddings(model_name="nomic-ai/nomic-embed-text-v1")
db = FAISS.load_local("tourism_vector_db", embeddings, allow_dangerous_deserialization=True)
db_retriever = db.as_retriever(search_type="similarity", search_kwargs={"k": 4})

prompt_template = """<s>[INST]You are a helpful travel assistant.
Provide short and clear answers about tourist places, hotels, transportation, and itineraries.
Always answer based on the given CONTEXT only.

CONTEXT: {context}
CHAT HISTORY: {chat_history}
QUESTION: {question}
ANSWER: </s>[INST]"""

prompt = PromptTemplate(
    template=prompt_template,
    input_variables=['context', 'question', 'chat_history']
)

os.environ["TOGETHER_AI"] = "MY_API_KEY"
TOGETHER_AI_API = os.environ["TOGETHER_AI"]

llm = Together(
    model="mistralai/Mistral-7B-Instruct-v0.2",
    temperature=0.5,
    max_tokens=512,
    together_api_key=TOGETHER_AI_API
)

memory = ConversationBufferWindowMemory(k=2, memory_key="chat_history", return_messages=True)

qa = ConversationalRetrievalChain.from_llm(
    llm=llm,
    memory=memory,
    retriever=db_retriever,
    return_source_documents=False,
    combine_docs_chain_kwargs={'document_variable_name': 'context'},
    output_key="answer"
)

# FastAPI for frontend connection #
app = FastAPI()

class QueryRequest(BaseModel):
    question: str

@app.post("/chat")
async def chat_endpoint(req: QueryRequest):
    result = qa.invoke({"question": req.question, "chat_history": []})
    return {"answer": result["answer"]}
