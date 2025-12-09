import { ArticlesMutateDrawer } from "./articles-mutate-drawer";
import { useArticles } from "./articles-provider";

export function ArticlesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useArticles();

  return (
    <>
      <ArticlesMutateDrawer
        key="article-create"
        open={open === "create"}
        onOpenChange={() => setOpen("create")}
        currentArticle={null}
      />

      <ArticlesMutateDrawer
        key={`article-update-${currentRow?.id}`}
        open={open === "update"}
        onOpenChange={() => {
          setOpen("update");
          setTimeout(() => {
            setCurrentRow(null);
          }, 500);
        }}
        currentArticle={currentRow}
      />
    </>
  );
}
