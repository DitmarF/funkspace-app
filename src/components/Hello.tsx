export function Hello({ name = 'FunkSpace' }) {
  return <h1 data-testid="greeting">Hello {name}</h1>;
}
