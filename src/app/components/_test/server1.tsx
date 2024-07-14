import { ClientComponent } from "./client";

export const ServerComponent1 = async ({ id }: { id: string }) => {
  const data = { name: "Server" };

  console.log("ServerComponent1")

  return (
    <>
      <div>これはServerComponent1</div>
    </>
  );
}
