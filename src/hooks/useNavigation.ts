/**
 * useNavigation Hook
 *
 * Convenient wrapper around NavigationContext for easy component usage.
 * Provides access to navigation state and methods.
 */

import { useNavigationContext } from '../context/NavigationContext';
import type { ViewType, ChatSubTab, BankSubTab, VaultSubTab, EventsSubTab } from '../context/NavigationContext';

export { ViewType, ChatSubTab, BankSubTab, VaultSubTab, EventsSubTab };

export const useNavigation = () => {
    return useNavigationContext();
};

export default useNavigation;
