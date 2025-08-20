import sqlite3, { Database } from 'sqlite3';
import { promisify } from 'util';
import { OptionEntry, OptionResponse, OptionDBRow } from '../../shared/types/index.js';

export class OptionsDatabase {
  private db: Database;

  constructor(dbPath: string = 'options.db') {
    this.db = new sqlite3.Database(dbPath);
    this.initializeDatabase();
  }

  private async initializeDatabase(): Promise<void> {
    const run = promisify(this.db.run.bind(this.db));
    
    await run(`
      CREATE TABLE IF NOT EXISTS options (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        option_type TEXT NOT NULL,
        strike_price REAL NOT NULL,
        expiry_date TEXT NOT NULL,
        size REAL NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  async addOption(option: OptionEntry): Promise<number> {
    return new Promise((resolve, reject) => {
      // Enhanced validation before database insertion
      if (!option.option_type || !['call', 'put'].includes(option.option_type)) {
        reject(new Error('Invalid option type'));
        return;
      }
      
      if (typeof option.strike_price !== 'number' || option.strike_price <= 0) {
        reject(new Error('Invalid strike price'));
        return;
      }
      
      if (typeof option.size !== 'number' || option.size <= 0) {
        reject(new Error('Invalid option size'));
        return;
      }
      
      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(option.expiry_date)) {
        reject(new Error('Invalid date format'));
        return;
      }
      
      const stmt = this.db.prepare(`
        INSERT INTO options (option_type, strike_price, expiry_date, size)
        VALUES (?, ?, ?, ?)
      `);
      
      stmt.run(
        [option.option_type, option.strike_price, option.expiry_date, option.size],
        function(this: sqlite3.RunResult, err: Error | null) {
          if (err) {
            console.error('Database insertion error:', err);
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
      
      stmt.finalize((err) => {
        if (err) {
          console.error('Statement finalization error:', err);
        }
      });
    });
  }

  async getOptions(): Promise<OptionResponse[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM options ORDER BY created_at DESC',
        (err: Error | null, rows: OptionDBRow[]) => {
          if (err) {
            reject(err);
          } else {
            const options: OptionResponse[] = rows.map(row => ({
              id: row.id,
              option_type: row.option_type as 'call' | 'put',
              strike_price: row.strike_price,
              expiry_date: row.expiry_date,
              size: row.size,
              created_at: row.created_at
            }));
            resolve(options);
          }
        }
      );
    });
  }

  async deleteOption(optionId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Validate input
      if (!Number.isInteger(optionId) || optionId <= 0) {
        reject(new Error('Invalid option ID'));
        return;
      }
      
      this.db.run(
        'DELETE FROM options WHERE id = ?',
        [optionId],
        function(this: sqlite3.RunResult, err: Error | null) {
          if (err) {
            console.error('Database deletion error:', err);
            reject(err);
          } else {
            resolve(this.changes > 0);
          }
        }
      );
    });
  }

  close(): void {
    this.db.close();
  }
}

// Export singleton instance
export const optionsDB = new OptionsDatabase();
