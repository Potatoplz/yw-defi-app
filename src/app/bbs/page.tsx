import { Tasks, columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { TASKS } from "./data/tasks";

async function getData(): Promise<Tasks[]> {
  // Fetch data from your API here.
  return TASKS.map((task) => ({
    ...task,
    status: task.status as
      | "processing"
      | "pending"
      | "failed"
      | "success"
      | "canceled",
  }));
}

export default async function DemoPage() {
  const tasks = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={tasks} />
    </div>
  );
}
