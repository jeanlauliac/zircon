import fs from "fs";
import path from "path";
import remark from "remark";
import html from "remark-html";
import yaml from "js-yaml";

const postsDirectory = path.join(process.cwd(), "recipes");

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.yaml$/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const data = yaml.load(fileContents);

    // Combine the data with the id
    return {
      id,
      ...(data as { date: string; title: string }),
    };
  });
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.yaml$/, ""),
      },
    };
  });
}

type Recipe = {
  method: string;
  ingredients: { quantity: number; unit: string; item: string }[];
  title: string;
  date: string;
};

type Ingredient = { title: string };
const ingredientTypes = new Map<string, Ingredient>([
  ["white_flour", { title: "white flour" }],
  ["gluten_free_flour", { title: "gluten-free flour" }],
  ["xantham_gum", { title: "xantham gum" }],
]);

type RecipeIngredient = { data: Ingredient; unit: string; quantity: number };
export type RecipeData = {
  id: string;
  contentHtml: string;
  ingredients: RecipeIngredient[];
  title: string;
  date: string;
};

export async function getPostData(id: string): Promise<RecipeData> {
  const fullPath = path.join(postsDirectory, `${id}.yaml`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const data: Recipe = yaml.load(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark().use(html).process(data.method);
  let contentHtml = processedContent.toString();

  const ingredients = data.ingredients.map((ingr) => ({
    data: ingredientTypes.get(ingr.item),
    quantity: ingr.quantity,
    unit: ingr.unit,
  }));

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ingredients,
    date: data.date,
    title: data.title,
  };
}
