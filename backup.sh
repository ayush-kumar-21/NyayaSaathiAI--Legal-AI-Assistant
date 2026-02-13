#!/bin/bash
# LegalOS 4.0 - Backup Script
# Usage: ./backup.sh [backup_directory]

set -e

BACKUP_DIR=${1:-./backups}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="$BACKUP_DIR/$TIMESTAMP"

mkdir -p "$BACKUP_PATH"

echo "Starting backup at $TIMESTAMP..."

# Backup database
echo "Backing up database..."
docker-compose exec -T db pg_dump -U postgres legalos > "$BACKUP_PATH/database.sql"

# Backup uploads
echo "Backing up uploads..."
docker cp "$(docker-compose ps -q backend)":/app/uploads "$BACKUP_PATH/uploads" || true

# Backup configuration
echo "Backing up configuration..."
cp .env "$BACKUP_PATH/env.backup" || true
cp docker-compose.yml "$BACKUP_PATH/" || true

# Create tarball
echo "Creating compressed archive..."
tar -czf "$BACKUP_DIR/legalos_backup_$TIMESTAMP.tar.gz" -C "$BACKUP_DIR" "$TIMESTAMP"

# Cleanup temp directory
rm -rf "$BACKUP_PATH"

echo "Backup completed: $BACKUP_DIR/legalos_backup_$TIMESTAMP.tar.gz"

# Keep only last 7 backups
echo "Cleaning up old backups..."
ls -t "$BACKUP_DIR"/legalos_backup_*.tar.gz 2>/dev/null | tail -n +8 | xargs rm -f || true

echo "Backup process completed!"
