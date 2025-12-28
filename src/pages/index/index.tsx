import { useMemo } from "react";
import { Route } from "../../routes";
import { useForm } from "../../hooks/use-form";
import { ScraperView } from "../../components/index/scraper-view";
import { ScraperPrompt } from "../../components/index/scraper-prompt";

export function Index() {
  const { query } = Route.useSearch();
  const searchTerm = useMemo(() => query?.trim() ?? "", [query]);

  const form = useForm<{
    readonly query: string;
  }>({
    defaultValues: {
      query: "",
    },
    resetOptions: {
      keepErrors: true,
      keepIsSubmitted: true,
    },
    reValidateMode: "onSubmit",
    values: {
      query: searchTerm,
    },
  });

  return searchTerm.length > 0 ? (
    <ScraperView form={form} query={searchTerm} />
  ) : (
    <ScraperPrompt form={form} />
  );
}
