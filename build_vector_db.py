import pandas as pd
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings

# Load dataset
df = pd.read_csv("tourism_data.csv")

# Combine fields into a text blob for embeddings
docs = []
for i, row in df.iterrows():
    text = f"Place: {row['Place']}. Description: {row['Description']}. Location: {row['Location']}. " \
           f"Opening Hours: {row['OpeningHours']}. Price: {row['Price']}."
    docs.append(text)

# Embedding model
embeddings = HuggingFaceEmbeddings(model_name="nomic-ai/nomic-embed-text-v1")

# Create FAISS vector DB
db = FAISS.from_texts(docs, embeddings)

# Save locally
db.save_local("tourism_vector_db")

#print("Tourism vector database created and saved locally!")

