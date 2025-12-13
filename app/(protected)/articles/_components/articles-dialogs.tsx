import { ArticlesDrawer } from "./articles-drawer";
import { useArticles } from "./articles-provider";

export function ArticlesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useArticles();

  return (
    <>
      <ArticlesDrawer
        key="article-create"
        open={open === "create"}
        onOpenChange={() => setOpen("create")}
        currentArticle={null}
      />

      <ArticlesDrawer
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
