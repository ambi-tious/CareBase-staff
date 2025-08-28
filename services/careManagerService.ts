import { careManagerMasterData, searchCareManagers } from '@/mocks/care-manager-data';
import type {
  CareManager,
  CareManagerFormData,
  CareManagerSearchOptions,
} from '@/types/care-manager';

/**
 * ケアマネージャーマスタサービス
 */
class CareManagerService {
  private readonly STORAGE_KEY = 'care_managers_master';

  /**
   * ローカルストレージから保存されたケアマネージャーマスタを取得
   */
  private getStoredCareManagers(): CareManager[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to parse stored care managers:', error);
    }
    return careManagerMasterData;
  }

  /**
   * ケアマネージャーマスタをローカルストレージに保存
   */
  private storeCareManagers(managers: CareManager[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(managers));
    } catch (error) {
      console.error('Failed to store care managers:', error);
    }
  }

  /**
   * すべてのケアマネージャーを取得
   */
  async getAllCareManagers(): Promise<CareManager[]> {
    // 実際の実装では API 呼び出し
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getStoredCareManagers());
      }, 100);
    });
  }

  /**
   * アクティブなケアマネージャーのみを取得
   */
  async getActiveCareManagers(): Promise<CareManager[]> {
    const managers = await this.getAllCareManagers();
    return managers.filter((manager) => manager.isActive);
  }

  /**
   * ケアマネージャーを検索
   */
  async searchCareManagers(options: CareManagerSearchOptions = {}): Promise<CareManager[]> {
    const managers = await this.getAllCareManagers();
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          searchCareManagers(managers, options.keyword, options.isActive, options.officeName)
        );
      }, 200);
    });
  }

  /**
   * IDでケアマネージャーを取得
   */
  async getCareManagerById(id: string): Promise<CareManager | null> {
    const managers = await this.getAllCareManagers();
    return managers.find((manager) => manager.id === id) || null;
  }

  /**
   * 名前でケアマネージャーを検索（完全一致）
   */
  async getCareManagerByName(name: string): Promise<CareManager | null> {
    const managers = await this.getAllCareManagers();
    return managers.find((manager) => manager.name === name) || null;
  }

  /**
   * 新しいケアマネージャーを追加
   */
  async createCareManager(data: CareManagerFormData): Promise<CareManager> {
    const managers = this.getStoredCareManagers();

    const newManager: CareManager = {
      id: `cm-${Date.now()}`,
      name: data.name,
      officeName: data.officeName,
      phone: data.phone || undefined,
      fax: data.fax || undefined,
      email: data.email || undefined,
      address: data.address || undefined,
      notes: data.notes || undefined,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    managers.push(newManager);
    this.storeCareManagers(managers);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(newManager);
      }, 300);
    });
  }

  /**
   * ケアマネージャー情報を更新
   */
  async updateCareManager(
    id: string,
    data: Partial<CareManagerFormData>
  ): Promise<CareManager | null> {
    const managers = this.getStoredCareManagers();
    const index = managers.findIndex((manager) => manager.id === id);

    if (index === -1) {
      return null;
    }

    const updatedManager: CareManager = {
      ...managers[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    managers[index] = updatedManager;
    this.storeCareManagers(managers);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(updatedManager);
      }, 300);
    });
  }

  /**
   * ケアマネージャーを無効化（論理削除）
   */
  async deactivateCareManager(id: string): Promise<boolean> {
    const managers = this.getStoredCareManagers();
    const index = managers.findIndex((manager) => manager.id === id);

    if (index === -1) {
      return false;
    }

    managers[index] = {
      ...managers[index],
      isActive: false,
      updatedAt: new Date().toISOString(),
    };

    this.storeCareManagers(managers);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 200);
    });
  }

  /**
   * ケアマネージャーを有効化
   */
  async activateCareManager(id: string): Promise<boolean> {
    const managers = this.getStoredCareManagers();
    const index = managers.findIndex((manager) => manager.id === id);

    if (index === -1) {
      return false;
    }

    managers[index] = {
      ...managers[index],
      isActive: true,
      updatedAt: new Date().toISOString(),
    };

    this.storeCareManagers(managers);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 200);
    });
  }

  /**
   * 事業所名の一覧を取得
   */
  async getOfficeNames(): Promise<string[]> {
    const managers = await this.getActiveCareManagers();
    const officeNames = [...new Set(managers.map((manager) => manager.officeName))];
    return officeNames.sort();
  }

  /**
   * ケアマネージャー選択用のオプションを取得
   */
  async getCareManagerOptions(): Promise<
    Array<{ value: string; label: string; officeName: string }>
  > {
    const managers = await this.getActiveCareManagers();
    return managers.map((manager) => ({
      value: manager.name,
      label: `${manager.name} (${manager.officeName})`,
      officeName: manager.officeName,
    }));
  }

  /**
   * ケアマネージャー名の候補を取得（部分一致検索）
   */
  async getCareManagerSuggestions(query: string): Promise<string[]> {
    if (!query || query.length < 1) {
      return [];
    }

    const managers = await this.getActiveCareManagers();
    const suggestions = managers
      .filter(
        (manager) =>
          manager.name.toLowerCase().includes(query.toLowerCase()) ||
          manager.officeName.toLowerCase().includes(query.toLowerCase())
      )
      .map((manager) => manager.name);

    return [...new Set(suggestions)];
  }
}

// シングルトンインスタンス
export const careManagerService = new CareManagerService();
