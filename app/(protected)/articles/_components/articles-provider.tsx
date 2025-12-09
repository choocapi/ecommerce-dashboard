import useDialogState from "@/hooks/use-dialog-state";
import type { IArticle } from "@/types/article";
import React, { useState } from "react";

type ArticlesDialogType = "create" | "update";

type ArticlesContextType = {
  open: ArticlesDialogType | null;
  setOpen: (str: ArticlesDialogType | null) => void;
  currentRow: IArticle | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<IArticle | null>>;
};

const ArticlesContext = React.createContext<ArticlesContextType | null>(null);

export function ArticlesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<ArticlesDialogType>(null);
  const [currentRow, setCurrentRow] = useState<IArticle | null>(null);

  return (
    <ArticlesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ArticlesContext>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useArticles = () => {
  const articlesContext = React.useContext(ArticlesContext);

  if (!articlesContext) {
    throw new Error("useArticles has to be used within <ArticlesContext>");
  }

  return articlesContext;
};
