import { en } from '@i18n/locales/en';
import { Layout } from '@layout';
import { getVersion } from '@tauri-apps/api/app';
import { act, fireEvent, render, screen, waitFor } from '@test/test-utils';

// Mock the Tauri API
vi.mock('@tauri-apps/api/app', () => ({
  getVersion: vi.fn(),
}));

describe('Layout', () => {
  const getSidebarToggleButton = () => screen.getByTestId('sidebar-toggle');
  const getThemeToggleButton = () => screen.getByTestId('theme-toggle');
  const getExpandIcon = () => screen.queryByTestId('expand-icon');
  const getCollapseIcon = () => screen.queryByTestId('collapse-icon');
  const getCodusText = () => screen.queryByText('Codus');
  const getVersionText = (version: string) => screen.getByText(`v${version}`);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getVersion).mockResolvedValue('1.0.0');
  });

  describe('Display App Version', () => {
    it('should display app version when successfully fetched', async () => {
      await act(async () => {
        render(<Layout />);
      });

      expect(getVersionText('1.0.0')).toBeInTheDocument();
    });

    it('should display fallback app version when fetch fails', async () => {
      vi.mocked(getVersion).mockRejectedValue(new Error('Failed to fetch version'));

      await act(async () => {
        render(<Layout />);
      });

      await waitFor(() => {
        expect(getVersionText('0.0.0')).toBeInTheDocument();
      });
    });
  });

  describe('Sidebar Toggle', () => {
    it('should have toggle functionality working', async () => {
      await act(async () => {
        render(<Layout />);
      });

      // Verify toggle button exists and initial expanded state
      expect(getSidebarToggleButton()).toBeInTheDocument();
      expect(getCodusText()).toBeInTheDocument();
      expect(getExpandIcon()).not.toBeInTheDocument();
      expect(getCollapseIcon()).toBeInTheDocument();

      // Toggle the sidebar to collapse
      await act(async () => {
        fireEvent.click(getSidebarToggleButton());
      });

      // Verify the collapsed sidebar state
      expect(getSidebarToggleButton()).toBeInTheDocument();
      expect(getCodusText()).not.toBeInTheDocument();
      expect(getExpandIcon()).toBeInTheDocument();
      expect(getCollapseIcon()).not.toBeInTheDocument();

      // Toggle the sidebar back to expand
      await act(async () => {
        fireEvent.click(getSidebarToggleButton());
      });

      // Verify the expanded sidebar state again
      expect(getCodusText()).toBeInTheDocument();
      expect(getExpandIcon()).not.toBeInTheDocument();
      expect(getCollapseIcon()).toBeInTheDocument();
    });
  });

  describe('Theme Toggle', () => {
    it('should toggle between light and dark themes', async () => {
      await act(async () => {
        render(<Layout />);
      });

      // Verify theme toggle button exists
      expect(getThemeToggleButton()).toBeInTheDocument();

      // Initial theme should be dark (default)
      expect(screen.getByText(en.theme.dark)).toBeInTheDocument();
      expect(screen.getByText(en.theme.toggle)).toBeInTheDocument();

      // Toggle to light theme
      await act(async () => {
        fireEvent.click(getThemeToggleButton());
      });

      // Verify light theme is now active
      expect(screen.getByText(en.theme.light)).toBeInTheDocument();
      expect(screen.getByText(en.theme.toggle)).toBeInTheDocument();

      // Toggle back to dark theme
      await act(async () => {
        fireEvent.click(getThemeToggleButton());
      });

      // Verify dark theme is active again
      expect(screen.getByText(en.theme.dark)).toBeInTheDocument();
    });
  });
});
