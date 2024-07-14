"use client";

type ClientComponentProps = {
  data: any;
};

export const ClientComponent = ({ data }: ClientComponentProps) => {

  console.log("ClientComponent");

  return <div>Hello {data}</div>;
};
