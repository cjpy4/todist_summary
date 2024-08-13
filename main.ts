// import the necessary dependency
import { config } from "https://deno.land/x/dotenv/mod.ts";

// Load environment variables from a .env file
config({ export: true });

const API_URL = "https://api.todoist.com/sync/v8/sync";
const TOKEN = Deno.env.get("TODOIST_API_TOKEN");

if (!TOKEN) {
  throw new Error("Please set the TODOIST_API_TOKEN environment variable.");
}

interface TodoistResponse {
  tasks: Array<any>;
}

async function fetchTasks() {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      sync_token: "*",
      resource_types: ["all"],
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.statusText}`);
  }

  const data: TodoistResponse = await response.json();
  return data.tasks;
}

async function main() {
  try {
    const tasks = await fetchTasks();
    console.log("Tasks:", tasks);
  } catch (error) {
    console.error(error);
  }
}

// Run the main function
main();
