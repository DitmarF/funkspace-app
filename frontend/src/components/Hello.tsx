type HelloProps = {
  name?: string;
};

export function Hello({ name = "FunkSpace" }: HelloProps) {
  return <h1 data-testid="greeting">Hello {name}</h1>;
}
