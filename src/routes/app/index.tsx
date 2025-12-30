import PageContainer from "@/components/layouts/PageContainer";
import { createFileRoute } from "@tanstack/react-router";
import AppHero from "./-compoents/AppHero";
import CardContainer, { arr } from "@/components/layouts/CardContainer";
import CompContainer from "@/components/layouts/CompContainer";
import Card from "@/components/Card";
import NewIn from "./-compoents/NewIn";
import Trending from "./-compoents/Trending";

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <AppHero />

      <PageContainer>
        {/*new in*/}
        <NewIn />
        {/*//trending*/}
        <Trending />
      </PageContainer>
    </>
  );
}
