import { AuthProvider } from '../providers/auth-provider';
import { DataService } from '../providers/data.service';
import { SqliteService } from '../providers/sqlite.service';
import { MappingsService } from '../providers/mappings.service';
import { ItemsService } from '../providers/items.service';

export const APP_PROVIDERS = [
    AuthProvider,
    DataService,
    ItemsService,
    SqliteService,
    MappingsService
];
