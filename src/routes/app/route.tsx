import PageFooter from "@/components/PageFooter";
import PageHeader from "@/components/PageHeader";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import AppDrawer from "./-compoents/AppDrawer";

export const Route = createFileRoute("/app")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="app-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content ">
          <PageHeader />

          {/* Page content here */}
          {/*<label htmlFor="products-drawer" className="btn drawer-button lg:hidden">
            Open drawer
          </label>*/}
          <Outlet />
          {/*<DrawerContent />*/}
        </div>
        <div className="drawer-side">
          <label
            htmlFor="app-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className=" bg-base-200 min-h-full w-2xs md:border-r fade flex">
            {/* Sidebar content here */}
            <AppDrawer />
          </div>
        </div>
      </div>
      <PageFooter />
    </>
  );
}
