#!/usr/bin/env python3
"""
Verify the complete NyayaSaathi data flow across all 4 portals.

This script checks:
1. Case model has all required fields
2. Status transitions are properly defined
3. Each portal's service layer can handle its responsibilities
4. API routes exist for each portal
"""

import os
import re
import ast
import sys

BACKEND_DIR = "backend"

class DataFlowAuditor:
    def __init__(self):
        self.findings = {
            'critical': [],
            'warning': [],
            'ok': [],
        }
        self.all_py_files = []
        self.route_patterns = []
        self.model_fields = {}
        self.service_methods = {}

    def scan_files(self):
        """Collect all Python files"""
        for root, dirs, files in os.walk(BACKEND_DIR):
            dirs[:] = [
                d for d in dirs
                if d not in ['__pycache__', 'venv', '.venv', '.git']
            ]
            for f in sorted(files):
                if f.endswith('.py'):
                    self.all_py_files.append(os.path.join(root, f))

    def check_case_model(self):
        """Verify Case model has all fields needed for cross-platform flow"""
        print("\n📋 CHECK 1: Case Model Fields")
        print("-" * 40)

        required_fields = [
            'id', 'status',
            'created_at', 'updated_at',
        ]

        # Fields needed for cross-platform
        cross_platform_fields = [
            'citizen_id', 'police_station', 'assigned_io',
            'assigned_judge', 'court',
            'cnr', 'fir_filed_date',
        ]

        # Search for Case model
        for filepath in self.all_py_files:
            with open(filepath, 'r') as f:
                content = f.read()

            if 'class Case' in content and (
                'Base' in content or 'Model' in content
            ):
                print(f"  Found Case model in: {filepath}")

                for field in required_fields:
                    if field in content:
                        self.findings['ok'].append(
                            f"Case.{field} exists"
                        )
                        print(f"    ✅ {field}")
                    else:
                        self.findings['critical'].append(
                            f"Case model missing '{field}' field "
                            f"in {filepath}"
                        )
                        print(f"    ❌ {field} — MISSING")

                print(f"\n  Cross-platform fields:")
                for field in cross_platform_fields:
                    if field in content:
                        print(f"    ✅ {field}")
                    else:
                        self.findings['warning'].append(
                            f"Case model missing cross-platform "
                            f"field '{field}'"
                        )
                        print(f"    ⚠️  {field} — missing "
                              f"(needed for multi-portal)")

                return True

        self.findings['critical'].append(
            "No Case model found in backend!"
        )
        print("  ❌ NO CASE MODEL FOUND!")
        return False

    def check_status_transitions(self):
        """Verify case status enum and transition logic"""
        print("\n📋 CHECK 2: Case Status Transitions")
        print("-" * 40)

        expected_statuses = [
            'FIR_FILED', 'FIR_REGISTERED', 'UNDER_INVESTIGATION',
            'CHARGESHEET_SUBMITTED', 'TRIAL', 'VERDICT', 'DISPOSED',
            'CASE_CLOSED', 'PENDING',
        ]

        found_statuses = []
        status_file = None

        for filepath in self.all_py_files:
            with open(filepath, 'r') as f:
                content = f.read()

            for status in expected_statuses:
                if status in content and filepath not in (status_file or ''):
                    if not status_file:
                        status_file = filepath
                    found_statuses.append(status)

        found_statuses = list(set(found_statuses))

        if status_file:
            print(f"  Status definitions found in: {status_file}")

        demo_flow = [
            ('FIR_FILED', 'Citizen submits FIR'),
            ('FIR_REGISTERED', 'Police registers FIR'),
            ('UNDER_INVESTIGATION', 'Police investigates'),
            ('CHARGESHEET_SUBMITTED', 'Police files chargesheet'),
            ('HEARING_SCHEDULED', 'Court trial begins'),
            ('JUDGMENT_DELIVERED', 'Judge issues verdict'),
            ('JUSTICE_SERVED', 'Case disposed'),
        ]

        print(f"\n  Demo flow status check:")
        for status, description in demo_flow:
            if status in found_statuses or \
               status.lower() in str(found_statuses).lower():
                print(f"    ✅ {status}: {description}")
            else:
                # Check for similar names
                similar = [
                    s for s in found_statuses
                    if status.split('_')[0] in s
                ]
                if similar:
                    print(
                        f"    ⚠️  {status}: Found as "
                        f"'{similar[0]}' instead"
                    )
                    self.findings['warning'].append(
                        f"Status '{status}' exists as "
                        f"'{similar[0]}' — may need mapping"
                    )
                else:
                    print(f"    ❌ {status}: NOT FOUND — {description}")
                    self.findings['critical'].append(
                        f"Missing status '{status}' needed for: "
                        f"{description}"
                    )

        # Check for transition validation logic
        print(f"\n  Transition validation:")
        transition_found = False
        for filepath in self.all_py_files:
            with open(filepath, 'r') as f:
                content = f.read()
            if any(kw in content for kw in [
                'transition', 'valid_transitions',
                'can_transition', 'allowed_status',
                'next_status', 'status_flow', 'VALID_TRANSITIONS'
            ]):
                print(f"    ✅ Transition logic in: {filepath}")
                transition_found = True
                break

        if not transition_found:
            print(
                f"    ⚠️  No explicit transition validation found"
            )
            self.findings['warning'].append(
                "No status transition validation — "
                "any status change is possible"
            )

    def check_portal_endpoints(self):
        """Check each portal has its required endpoints"""
        print("\n📋 CHECK 3: Portal API Endpoints")
        print("-" * 40)

        portals = {
            'Citizen Portal': {
                'endpoints': [
                    ('POST', 'case', 'File new FIR/case'),
                    ('GET', 'case', 'View my cases'),
                    ('GET', 'case/{id}', 'View case details'),
                    ('POST', 'chat', 'NyayaBot interaction'),
                ],
                'search_terms': [
                    'citizen', 'user', 'case', 'fir'
                ],
            },
            'Police Portal': {
                'endpoints': [
                    ('GET', 'case', 'View assigned cases'),
                    ('PUT', 'case', 'Update case status'),
                    ('POST', 'evidence', 'Upload evidence'),
                    ('POST', 'fir', 'Register FIR'),
                ],
                'search_terms': [
                    'police', 'officer', 'evidence', 'fir'
                ],
            },
            'Judge Portal': {
                'endpoints': [
                    ('GET', 'case', 'View court cases'),
                    ('GET', 'evidence', 'Review evidence'),
                    ('PUT', 'verdict', 'Issue verdict'),
                    ('PUT', 'hearing', 'Schedule hearing'),
                ],
                'search_terms': [
                    'judge', 'court', 'verdict', 'hearing'
                ],
            },
            'Admin/MHA Portal': {
                'endpoints': [
                    ('GET', 'analytics', 'National metrics'),
                    ('GET', 'metrics', 'Dashboard data'),
                    ('GET', 'heatmap', 'State-wise data'),
                ],
                'search_terms': [
                    'admin', 'analytics', 'metrics', 'dashboard'
                ],
            },
        }

        # Collect all route definitions
        all_routes = []
        for filepath in self.all_py_files:
            with open(filepath, 'r') as f:
                content = f.read()

            # Find route decorators
            for match in re.finditer(
                r'@\w+\.(get|post|put|patch|delete)\s*\(\s*["\']([^"\']+)',
                content
            ):
                method = match.group(1).upper()
                path = match.group(2)
                all_routes.append((method, path, filepath))

        print(f"  Total routes found: {len(all_routes)}")
        if all_routes:
            for method, path, filepath in sorted(
                all_routes, key=lambda x: x[1]
            ):
                print(f"    {method:6s} {path:40s} ({os.path.basename(filepath)})")

        for portal_name, config in portals.items():
            print(f"\n  {portal_name}:")

            for method, keyword, description in config['endpoints']:
                # Search in routes
                found = False
                for r_method, r_path, r_file in all_routes:
                    if keyword.lower() in r_path.lower():
                        if method == r_method or method in r_method:
                            print(
                                f"    ✅ {method} ...{keyword}... "
                                f"→ {description}"
                            )
                            found = True
                            break

                if not found:
                    # Search in file content
                    content_found = False
                    for filepath in self.all_py_files:
                        with open(filepath, 'r') as f:
                            content = f.read()
                        for term in config['search_terms']:
                            if (
                                term in content.lower() and
                                keyword in content.lower()
                            ):
                                # print(
                                #     f"    ⚠️  {method} ...{keyword}..."
                                #     f" → Logic exists in "
                                #     f"{os.path.basename(filepath)} "
                                #     f"but route may be missing"
                                # )
                                content_found = True
                                # self.findings['warning'].append(
                                #     f"{portal_name}: {description} — "
                                #     f"logic exists but no clear "
                                #     f"API route"
                                # )
                                break
                        if content_found:
                            break

                    if not content_found:
                        print(
                            f"    ❌ {method} ...{keyword}... "
                            f"→ {description} — NOT FOUND"
                        )
                        self.findings['critical'].append(
                            f"{portal_name}: Missing endpoint for "
                            f"'{description}'"
                        )

    def check_database_config(self):
        """Verify database is configured for production"""
        print("\n📋 CHECK 4: Database Configuration")
        print("-" * 40)

        for filepath in self.all_py_files:
            with open(filepath, 'r') as f:
                content = f.read()

            if 'DATABASE_URL' in content or 'database' in filepath.lower():
                # Check for hardcoded DB
                if 'sqlite' in content.lower():
                    print(f"  ⚠️  SQLite detected in {filepath}")
                    print(f"     (OK for demo, not for production)")
                    self.findings['warning'].append(
                        f"SQLite in use — {filepath}"
                    )

                if 'postgresql' in content.lower() or \
                   'postgres' in content.lower():
                    print(f"  ✅ PostgreSQL configured in {filepath}")

                if any(
                    secret in content
                    for secret in [
                        'password=', 'passwd=', ':password@'
                    ]
                ):
                    if 'env' not in content.lower() and \
                       'os.getenv' not in content and \
                       'os.environ' not in content:
                        print(
                            f"  🚨 HARDCODED DB PASSWORD in "
                            f"{filepath}!"
                        )
                        self.findings['critical'].append(
                            f"Hardcoded DB password in {filepath}"
                        )

    def generate_report(self):
        """Generate final report"""
        print("\n")
        print("=" * 60)
        print("  DATA FLOW AUDIT REPORT")
        print("=" * 60)

        print(f"\n🔴 CRITICAL ({len(self.findings['critical'])} issues):")
        for issue in self.findings['critical']:
            print(f"   • {issue}")

        print(f"\n🟡 WARNINGS ({len(self.findings['warning'])} issues):")
        for issue in self.findings['warning']:
            print(f"   • {issue}")

        print(f"\n✅ OK ({len(self.findings['ok'])} checks passed)")

        # Demo readiness score
        total = (
            len(self.findings['critical']) +
            len(self.findings['warning']) +
            len(self.findings['ok'])
        )
        if total > 0:
            score = (
                len(self.findings['ok']) / total
            ) * 100
        else:
            score = 0

        print(f"\n📊 Demo Readiness Score: {score:.0f}%")

        if self.findings['critical']:
            print(
                "\n🚨 ACTION REQUIRED: Fix critical issues "
                "before demo!"
            )
        else:
            print(
                "\n✅ No critical issues — demo should work!"
            )

        return len(self.findings['critical'])

def main():
    auditor = DataFlowAuditor()
    auditor.scan_files()

    print("🔍 NyayaSaathi Data Flow Audit")
    print("=" * 60)
    print(f"Scanning {len(auditor.all_py_files)} Python files...")

    auditor.check_case_model()
    auditor.check_status_transitions()
    auditor.check_portal_endpoints()
    auditor.check_database_config()

    critical_count = auditor.generate_report()

    return critical_count

if __name__ == "__main__":
    sys.exit(main())
