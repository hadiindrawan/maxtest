/**
 * Snapshot of the Maxtest MCP tool registry.
 * Source: akewops-be/app/mcp/tools/*.py (register_spec calls), taken 2026-10-05, 41 tools.
 * Descriptions are written for this site, not copied from the backend. When the backend adds or
 * renames a tool, update this file; the tests pin the counts so drift is noticed.
 * The backend also defines an "external" risk class and scope, but no tool uses it today.
 */
export type RiskClass = "read" | "write" | "execution" | "destructive";

export interface McpTool {
  name: string;
  risk: RiskClass;
  title: string;
  description: string;
}

const t = (risk: RiskClass, name: string, title: string, description: string): McpTool => ({ name, risk, title, description });

export const MCP_TOOLS: McpTool[] = [
  t("read", "maxtest_find_suite", "Find suite by name", "Find a test suite by name."),
  t("read", "maxtest_get_execution", "Get execution", "Get one execution with its status and results."),
  t("read", "maxtest_get_jira_issue", "Get Jira issue", "Read a Jira issue to use as test context."),
  t("read", "maxtest_get_report", "Get report", "Get one detailed test report."),
  t("read", "maxtest_get_test_case", "Get test case", "Get one test case with its steps."),
  t("read", "maxtest_get_test_execution", "Get test execution", "Get one test-case execution result in detail."),
  t("read", "maxtest_get_test_launch", "Get test launch", "Get one launch with its status."),
  t("read", "maxtest_get_test_plan", "Get test plan", "Get one test plan."),
  t("read", "maxtest_list_launch_executions", "List launch executions", "List the executions inside a launch."),
  t("read", "maxtest_list_projects", "List projects", "List the projects you are a member of."),
  t("read", "maxtest_list_reports", "List reports", "List test reports."),
  t("read", "maxtest_list_test_cases_by_suite", "List test cases in a suite", "List the test cases in a suite."),
  t("read", "maxtest_list_test_launches", "List test launches", "List test launches."),
  t("read", "maxtest_list_test_plans", "List test plans", "List test plans."),
  t("read", "maxtest_list_test_suites", "List test suites", "List test suites."),
  t("read", "maxtest_search_execution_history", "Search execution history", "Find past test-case results by meaning, failures first."),
  t("read", "maxtest_search_executions", "Search executions", "Search executions."),
  t("read", "maxtest_search_reports", "Search reports", "Search reports."),
  t("read", "maxtest_search_test_cases", "Search test cases", "Search test cases."),
  t("read", "maxtest_search_test_launches", "Search test launches", "Search test launches."),
  t("read", "maxtest_search_test_plans", "Search test plans", "Search test plans."),
  t("write", "maxtest_attach_to_execution", "Attach evidence to an execution", "Attach screenshots, logs or HAR files to an execution."),
  t("write", "maxtest_create_attachment_upload", "Create an attachment upload URL", "Get an upload URL for an attachment."),
  t("write", "maxtest_create_test_cases", "Create test cases", "Create test cases."),
  t("write", "maxtest_create_test_launch", "Create test launch", "Create a test launch."),
  t("write", "maxtest_create_test_plan", "Create test plan", "Create a test plan."),
  t("write", "maxtest_create_test_suite", "Create test suite", "Create a test suite."),
  t("write", "maxtest_delete_test_launch_preview", "Preview test launch deletion", "Preview what deleting a launch would remove."),
  t("write", "maxtest_delete_test_plan_preview", "Preview test plan deletion", "Preview what deleting a plan would remove."),
  t("write", "maxtest_fetch_new_test_cases", "Fetch new test cases into a launch", "Pull new test cases into a launch."),
  t("write", "maxtest_generate_report", "Generate report", "Generate the report for a finished launch."),
  t("write", "maxtest_propose_test_cases", "Propose test cases for review", "Stage AI-written test cases as drafts for human approval."),
  t("write", "maxtest_update_execution_status", "Update execution status", "Record the result of one execution."),
  t("write", "maxtest_update_execution_statuses", "Update many execution statuses", "Record results for up to 50 executions at once."),
  t("write", "maxtest_update_test_launch", "Update test launch", "Update a launch."),
  t("write", "maxtest_update_test_plan", "Update test plan", "Update a plan."),
  t("write", "maxtest_update_test_suite", "Update test suite", "Update a suite."),
  t("execution", "maxtest_run_execution", "Run single execution", "Run a single execution on the Pancake Runner."),
  t("execution", "maxtest_run_suite", "Run suite", "Run a whole suite on the Pancake Runner."),
  t("destructive", "maxtest_delete_test_launch", "Delete test launch", "Delete a launch (preview, then confirm)."),
  t("destructive", "maxtest_delete_test_plan", "Delete test plan", "Delete a plan (preview, then confirm)."),
];

export interface RiskGroup {
  risk: RiskClass;
  label: string;
  icon: "eye" | "pencil" | "play" | "trash-2";
  state: string;
}

export const RISK_GROUPS: RiskGroup[] = [
  { risk: "read", label: "Read", icon: "eye", state: "On by default" },
  { risk: "write", label: "Write", icon: "pencil", state: "Off until a company admin enables it" },
  { risk: "execution", label: "Execution", icon: "play", state: "Off until a company admin enables it" },
  { risk: "destructive", label: "Destructive", icon: "trash-2", state: "Off until enabled; preview, then confirm" },
];

export function toolsByRisk(risk: RiskClass): McpTool[] {
  return MCP_TOOLS.filter((tool) => tool.risk === risk);
}
