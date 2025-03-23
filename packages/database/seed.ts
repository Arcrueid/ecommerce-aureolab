import { faker } from "@faker-js/faker";
import "dotenv/config";
import { reset } from "drizzle-seed";
import { db } from "./database";
import { productsTable } from "./schema";

function removeDiacritics(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

async function main() {
  // Clean products table
  await reset(db, {
    productsTable,
    reset: true,
  });

  // Create array of products with unique data
  const productValues = Array.from({ length: 100 }, () => {
    const productName = faker.commerce.productName();
    const slug = removeDiacritics(productName.toLowerCase()).replace(
      /\s+/g,
      "-"
    );

    return {
      name: productName,
      slug: slug,
      price: faker.number.int({ min: 5000, max: 10000 }),
      description: faker.commerce.productDescription(),
      image: faker.image.urlPicsumPhotos({
        width: 720,
        height: 720,
        blur: 0,
        grayscale: false,
      }),
      createdAt: new Date(),
    };
  });

  // Insert all products
  await db.insert(productsTable).values(productValues);

  process.exit(0);
}

main();
