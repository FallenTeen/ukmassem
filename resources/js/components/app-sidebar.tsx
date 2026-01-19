import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    CalendarDays,
    Database,
    FileText,
    Folder,
    FolderKanban,
    LayoutGrid,
    UserCog,
    Users,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem, type SharedData } from '@/types';

import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const userRole = String(auth.user.role || '');
    const kadivRoles = ['kad_fot', 'kad_fil', 'kad_tar', 'kad_mus', 'kad_tea'];

    const hasAccess = (roles: string[]) => roles.includes(userRole);

    const mainNavItems: Array<
        NavItem | (Omit<NavItem, 'href'> & { items: NavItem[] })
    > = [];

    mainNavItems.push({
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    });

    if (hasAccess(['rajawebsite', 'ketum_waketum', 'sekretaris'])) {
        const dataMasterItems: NavItem[] = [
            {
                title: 'Kelola Anggota',
                href: '/kelola-anggota',
                icon: Users,
            },
            {
                title: 'Main Proker',
                href: '/main-proker',
                icon: Folder,
            },
            {
                title: 'Jenis Rapat',
                href: '/rapat/master-jenis',
                icon: FileText,
            },
        ];

        if (hasAccess(['rajawebsite', 'dm'])) {
            dataMasterItems.splice(1, 0, {
                title: 'User Account',
                href: '/user-account',
                icon: UserCog,
            });
        }

        mainNavItems.push({
            title: 'Data Master',
            icon: Database,
            items: dataMasterItems,
        });
    }

    if (hasAccess(['rajawebsite', 'ketum_waketum', 'sekretaris', ...kadivRoles])) {
        mainNavItems.push({
            title: 'Proker',
            href: '/proker',
            icon: FolderKanban,
        });
    }

    if (
        hasAccess([
            'rajawebsite',
            'ketum_waketum',
            'sekretaris',
            'anggota',
            ...kadivRoles,
        ])
    ) {
        mainNavItems.push({
            title: 'Rapat',
            icon: CalendarDays,
            items: [
                {
                    title: 'Kalender',
                    href: '/rapat/calendar',
                    icon: CalendarDays,
                },
                {
                    title: 'Daftar Rapat',
                    href: '/rapat',
                    icon: FileText,
                },
            ],
        });
    }

    if (hasAccess(['rajawebsite', 'ketum_waketum', 'sekretaris'])) {
        mainNavItems.push({
            title: 'Laporan',
            href: '/dashboard/statistik',
            icon: BarChart3,
        });
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
