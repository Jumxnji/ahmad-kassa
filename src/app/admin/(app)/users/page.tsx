import { Users as UsersIcon } from "lucide-react";
import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { DataTable, type DataTableColumn } from "@/dashboard/components/data-table";
import { StatusBadge } from "@/dashboard/components/status-badge";
import { UserFormDialog } from "@/dashboard/components/user-form-dialog";
import { UserRowActions } from "@/dashboard/components/user-row-actions";
import { TableSearchForm } from "@/dashboard/components/table-toolbar";
import { PaginationControls } from "@/dashboard/components/pagination-controls";
import { EmptyState } from "@/components/shared/empty-state";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { userService } from "@/services/user.service";
import { ROLE_LABELS } from "@/permissions/roles";
import { formatDate } from "@/lib/format";
import { buildListHref, pageCount, parseListQuery, type RawListSearchParams } from "@/lib/list-query";
import { requirePageAccess } from "@/permissions/require-page-access";
import { can } from "@/permissions/permissions";
import type { User } from "@/generated/prisma/client";

export const metadata = { title: "Users" };

const BASE_PATH = "/admin/users";
const STATUS_TONE = { ACTIVE: "success", INVITED: "warning", SUSPENDED: "muted" } as const;

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

interface UsersPageProps {
  searchParams: Promise<RawListSearchParams>;
}

export default async function AdminUsersPage({ searchParams }: UsersPageProps) {
  const currentUser = await requirePageAccess("users");
  const canManage = can(currentUser.role, "users", "update");
  const canInvite = can(currentUser.role, "users", "create");

  const query = parseListQuery(await searchParams, "createdAt");
  const { rows: users, total } = await userService.listPaged(query);

  const columns: DataTableColumn<User>[] = [
    {
      key: "name",
      header: "User",
      sortKey: "name",
      cell: (u) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarFallback className="bg-navy-900 text-xs text-gold-300">
              {initials(u.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground">{u.name}</p>
            <p className="text-xs text-muted-foreground">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      sortKey: "role",
      cell: (u) => <StatusBadge label={ROLE_LABELS[u.role]} tone="neutral" />,
    },
    {
      key: "status",
      header: "Status",
      sortKey: "status",
      cell: (u) => <StatusBadge label={u.status} tone={STATUS_TONE[u.status]} />,
    },
    {
      key: "lastLoginAt",
      header: "Last login",
      sortKey: "lastLoginAt",
      cell: (u) => (
        <span className="text-sm text-muted-foreground">
          {u.lastLoginAt ? formatDate(u.lastLoginAt.toISOString()) : "Never"}
        </span>
      ),
    },
    ...(canManage
      ? [
          {
            key: "actions",
            header: "",
            className: "w-24",
            cell: (u: User) => <UserRowActions user={u} />,
          } satisfies DataTableColumn<User>,
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Users"
        description="Who has access to the dashboard, and what they can do."
        actions={canInvite ? <UserFormDialog /> : undefined}
      />

      <TableSearchForm
        action={BASE_PATH}
        placeholder="Search users…"
        defaultValue={query.q}
        preserve={{ sort: query.sort, dir: query.dir }}
      />

      {users.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title={query.q ? `No users match "${query.q}"` : "No users yet"}
          description={query.q ? "Try a different search term." : "Invite someone to get started."}
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={users}
            getRowKey={(u) => u.id}
            sort={{ key: query.sort, dir: query.dir }}
            buildSortHref={(key, dir) => buildListHref(BASE_PATH, query, { sort: key, dir, page: 1 })}
          />
          <PaginationControls
            page={query.page}
            pageCount={pageCount(total, query.pageSize)}
            total={total}
            itemLabel="user"
            buildHref={(page) => buildListHref(BASE_PATH, query, { page })}
          />
        </>
      )}
    </div>
  );
}
