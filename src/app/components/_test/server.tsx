import { ClientComponent } from "./client";
import { ServerComponent1 } from './server1';

export const ServerComponent = async ({ id }: { id: string }) => {
  // const response = await fetch(`/endpoints/${id}`);
  // const data = await response.json();

  const data = "test";

  console.log("ServerComponent")

  return (
    <>
      <div>これはServerComponent</div>
      {/* RSCからRSCを渡すことも可能。 */}
      <ServerComponent1 id="1" />
      <ClientComponent data={data} />
    </>
  );
}
