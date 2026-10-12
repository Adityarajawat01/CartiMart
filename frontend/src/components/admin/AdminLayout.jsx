import { LayoutDashboard, Package, Plus, ShoppingBag } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/products/new", label: "Add product", icon: Plus },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
];

const AdminLayout = () => (
  <div className="min-h-screen bg-slate-50">
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-700">
          CartiMart management
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-950">
          Admin workspace
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage your catalog and keep track of store activity.
        </p>
      </div>

      <div className="grid gap-7 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <nav aria-label="Admin navigation" className="flex gap-2 overflow-x-auto lg:flex-col">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-violet-700 text-white shadow-sm"
                      : "text-slate-600 hover:bg-violet-50 hover:text-violet-800"
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <section className="min-w-0">
          <Outlet />
        </section>
      </div>
    </div>
  </div>
);

export default AdminLayout;
