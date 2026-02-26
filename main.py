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
print(f"\nLocality with the highest average rate per sqft: {highest_rate_locality}\n")

#question 4: Do ready-to-move properties cost more than under-construction properties?
ready_to_move_avg_price = df[df['status'] == 'ready to move']['price'].mean()
under_construction_avg_price = df[df['status'] == 'under construction']['price'].mean()
if ready_to_move_avg_price > under_construction_avg_price:
    print("Ready-to-move properties cost more than under-construction properties.\n")
else:
    print("Under-construction properties cost more than ready-to-move properties.\n")

#question 5: Do RERA-approved properties command a price premium?
rera_approved_avg_price = df[df['rera_approval'] == True]['price'].mean()
not_rera_approved_avg_price = df[df['rera_approval'] == False]['price'].mean()
if rera_approved_avg_price > not_rera_approved_avg_price:
    print("RERA-approved properties command a price premium.\n")  
else:
    print("RERA-approved properties do not command a price premium.\n")

#question 6: How does area (sqft) impact property price?
sns.scatterplot(x='area', y='price', data=df)
plt.title('Area vs Price')
plt.xlabel('Area (sqft)')
plt.ylabel('Price')
plt.show()

# question 7: which BHK configuration is most expensive based on per sqft rate?
bhk_avg_rate = df.groupby('bhk_count')['rate_per_sqft'].mean()
most_expensive_bhk = bhk_avg_rate.idxmax()
print(f"The most expensive BHK configuration is: {most_expensive_bhk} BHK with an average rate of {bhk_avg_rate[most_expensive_bhk]:.2f} per sqft.\n")

#question 8: Which property type (Apartment, Floor, Plot) is the costliest?
property_type_avg_price = df.groupby('property_type')['price'].mean()
costliest_property_type = property_type_avg_price.idxmax()
print(f"The costliest property type is: {costliest_property_type} with an average price of {property_type_avg_price[costliest_property_type]:.2f}.\n")

#question 9: Do certain builders or companies consistently price higher?
builder_avg_price = df.groupby('builder_name')['rate_per_sqft'].mean().sort_values(ascending=False)
print("Top 5 builders with the highest average property prices:")
print(builder_avg_price.head(5))

#question 10: Are larger homes always more expensive per square foot?
sns.scatterplot(x='area', y='rate_per_sqft', data=df)
plt.title('Area vs Rate per Sqft')
plt.xlabel('Area (sqft)')
plt.ylabel('Rate per Sqft')
plt.show()
