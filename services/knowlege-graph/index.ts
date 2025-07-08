import { driver } from "@/lib/neo4j";

interface UserPreferences {
  cuisines?: string[];
  allergens?: string[];
  spiceLevel?: "mild" | "medium" | "hot";
  dietaryRestrictions?: string[];
  priceRange?: "budget" | "mid-range" | "premium";
}

export async function updateUserProfileInGraph({
  userId,
  name,
  email,
  preferences,
}: {
  userId: string;
  name?: string;
  email?: string;
  preferences: UserPreferences;
  reasoning?: string;
}) {
  const session = driver.session();
  try {
    await session.writeTransaction((tx) =>
      tx.run(
        `
        MERGE (u:User {id: $userId})
        SET u.name = $name, u.email = $email
        WITH u
        FOREACH (allergy IN $allergens | 
          MERGE (i:Ingredient {name: allergy})
          MERGE (u)-[:HAS_ALLERGY]->(i)
        )
        FOREACH (restriction IN $dietaryRestrictions | 
          SET u.dietaryRestrictions = $dietaryRestrictions
        )
        FOREACH (cuisine IN $cuisines | 
          SET u.cuisines = $cuisines
        )
        SET u.spiceLevel = $spiceLevel, u.priceRange = $priceRange
        `,
        {
          userId,
          name,
          email,
          allergens: preferences.allergens || [],
          dietaryRestrictions: preferences.dietaryRestrictions || [],
          cuisines: preferences.cuisines || [],
          spiceLevel: preferences.spiceLevel || null,
          priceRange: preferences.priceRange || null,
        },
      ),
    );
  } finally {
    await session.close();
  }
}

export async function logOrderInGraph({
  userId,
  cart,
}: {
  userId: string;
  cart: Array<{ name: string; price: number }>;
}) {
  const session = driver.session();
  try {
    for (const item of cart) {
      await session.writeTransaction((tx) =>
        tx.run(
          `
          MERGE (u:User {id: $userId})
          MERGE (m:MenuItem {name: $name, price: $price})
          MERGE (u)-[:ORDERED]->(m)
          `,
          {
            userId,
            name: item.name,
            price: item.price,
          },
        ),
      );
    }
  } finally {
    await session.close();
  }
}
