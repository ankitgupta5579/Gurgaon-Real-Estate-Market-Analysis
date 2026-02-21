import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

df = pd.read_csv('data.csv')
# print(df.info())

#data cleaning
df.columns = df.columns.str.strip().str.lower().str.replace(' ', '_')

#numeric columns cleaning
df['price'] = df['price'].astype(str).str.replace(',', '').astype(float)
df['area'] = df['area'].astype(str).str.replace(',', '').astype(int)
df['rate_per_sqft'] = df['rate_per_sqft'].astype(str).str.replace(',', '').astype(int)
# print(df['rate_per_sqft'])

#categorical columns cleaning
df['status'] = df['status'].str.strip().str.lower()
df['rera_approval'] = df['rera_approval'].str.strip().str.lower().map({'approved by rera': True, 'not approved by rera': False})
# print(df['rera_approval'])

df = df.drop_duplicates()
# print(df.info())

#question 1: which is the costliest flat in the dataset?
costliest_flat = df.loc[df['price'].idxmax()]
# print("Costliest flat details:")
# print(costliest_flat)
#printing all the above details in a single sentence including all the above details
print(f"The costliest flat is located in {costliest_flat['locality']} with an area of {costliest_flat['area']} sqft, priced at {costliest_flat['price']} and has a rate of {costliest_flat['rate_per_sqft']} per sqft. It is currently {costliest_flat['status']} and RERA approved: {costliest_flat['rera_approval']}.")

#question 2: which locality has the highest average price?
highest_avg_price_locality = df.groupby('locality')['price'].mean().idxmax()
print(f"\nLocality with the highest average price: {highest_avg_price_locality}")

#question 3: which locality has the highest rate per sqft?
highest_rate_locality = df.groupby('locality')['rate_per_sqft'].mean().idxmax()
print(f"\nLocality with the highest average rate per sqft: {highest_rate_locality}")

#question 4: Do ready-to-move properties cost more than under-construction properties?
ready_to_move_avg_price = df[df['status'] == 'ready to move']['price'].mean()
under_construction_avg_price = df[df['status'] == 'under construction']['price'].mean
print(f"\nAverage price of ready-to-move properties: {ready_to_move_avg_price}")
print(f"Average price of under-construction properties: {under_construction_avg_price}")
