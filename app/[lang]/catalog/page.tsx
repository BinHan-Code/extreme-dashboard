import CatalogClient from "./CatalogClient";

export default async function CatalogPage({ searchParams }: PageProps<"/[lang]/catalog">) {
  const { category, q } = await searchParams;
  return (
    <CatalogClient
      categoryParam={typeof category === "string" ? category : ""}
      qParam={typeof q === "string" ? q : ""}
    />
  );
}
