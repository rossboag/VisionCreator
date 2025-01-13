# Set variables
BACKUP_DIR="/path/to/backup/directory"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/visioncreator_backup_$TIMESTAMP.sql"

# Perform the backup
pg_dump -U $DB_USER -d $DB_NAME > $BACKUP_FILE

# Compress the backup
gzip $BACKUP_FILE

echo "Database backup completed: ${BACKUP_FILE}.gz"

# Delete backups older than 7 days
find $BACKUP_DIR -name "visioncreator_backup_*.sql.gz" -mtime +7 -delete

