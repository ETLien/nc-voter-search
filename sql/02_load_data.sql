/*
SCRIPT 02: LOAD DATA (MANUAL STEP)
Purpose:
- Load data into the Azure PostgreSQL tables after running 01_create_tables.sql.
Important:
- This script contains NO executable SQL by design.
- Data is loaded manually using pgAdmin.
Tables:
- public.nc_vhis_history
- public.nc_vreg_history

----------------------------
STEP 1: Load nc_vhis_history
----------------------------

In pgAdmin:
1. Expand Databases > your Azure DB > Schemas > public > Tables
2. Right-click table: nc_vhis_history
3. Choose "Import/Export Data..."
4. Select "Import"
5. Filename: <path to your local nc_vhis_history file>
6. Format: CSV
7. Delimiter: \t  (TAB)
8. Header: Yes
9. Encoding: UTF8
10. Click "OK" and wait for completion
Verify: SELECT COUNT(*) FROM public.nc_vhis_history;

----------------------------
STEP 2: Load nc_vreg_history
----------------------------

In pgAdmin:
1. Right-click table: nc_vreg_history
2. Choose "Import/Export Data..."
3. Select "Import"
4. Filename: <path to your local nc_vreg_history file>
5. Format: CSV
6. Delimiter: \t  (TAB)
7. Header: Yes
8. Encoding: UTF8
9. Click "OK" and wait for completion
Verify: SELECT COUNT(*) FROM public.nc_vreg_history;

---------------------------------------------
STEP 3: After both tables are fully loaded...
---------------------------------------------

Run script: 03_build_indexes_and_latest.sql
DO NOT build indexes before data load completes.
*/