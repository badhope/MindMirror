# Development Workflow Guidelines

> **Standard Operating Procedures for AI Assistants**
> 
> This file defines the workflow framework and quality standards.

---

## 🔄 Standard Workflow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Understand │ -> │   Design    │ -> │   Execute   │ -> │   Verify    │ -> │   Deliver   │
│    Task     │    │   Solution  │    │   Implement │    │   Results   │    │   & Review  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

---

## Phase 1: Understand Task

### Input
- User request (may contain speech errors)
- Historical context (from memory)
- Current project state

### Process
1. **Apply Intent Correction**
   - Check `INTENT-CORRECTION.md` for common mispronunciations
   - Infer true intent from context
   - Confirm with user if uncertain

2. **Clarify Requirements**
   - Identify objective
   - Identify constraints
   - Identify expected output format
   - Identify success criteria

### Output
- Clear task definition
- List of requirements
- List of constraints

### Checkpoints
- [ ] Is the objective clear?
- [ ] Are constraints identified?
- [ ] Is output format defined?
- [ ] Are success criteria established?
- [ ] Is clarification needed?

---

## Phase 2: Design Solution

### Input
- Task definition from Phase 1

### Process
1. **Analyze Problem**
   - Break down into subtasks
   - Identify dependencies
   - Identify risks

2. **Design Approach**
   - Choose appropriate tools/resources
   - Define solution architecture
   - Consider alternatives

3. **Create Plan**
   - Step-by-step execution plan
   - Resource requirements
   - Timeline estimation

### Output
- Solution design document
- Execution plan
- Risk assessment

### Checkpoints
- [ ] Is the solution feasible?
- [ ] Are boundary cases considered?
- [ ] Are there alternative approaches?
- [ ] Are risks identified?

---

## Phase 3: Execute Implementation

### Input
- Execution plan from Phase 2

### Process
1. **Load Resources**
   - Clone/load required skills from AI-SKILL (see RESOURCES.md)
   - Get prompts from PromptHub (see RESOURCES.md)
   - Search and provide MCP server install guides from Mcp-Market (see RESOURCES.md)
   - Search and recommend APIs from API-Market (see RESOURCES.md)

2. **Execute Tasks**
   - Follow plan step by step
   - Handle blockers
   - Adjust if needed

3. **Document Progress**
   - Update todo list
   - Record decisions
   - Log issues

### Output
- Implementation artifacts (code, documents, etc.)
- Progress logs
- Issue records

### Checkpoints
- [ ] Are required resources loaded?
- [ ] Is execution following plan?
- [ ] Are blockers resolved?
- [ ] Is progress documented?

---

## Phase 4: Verify Results

### Input
- Implementation artifacts from Phase 3

### Process
1. **Quality Check**
   - Check against requirements
   - Check code quality (if applicable)
   - Check documentation completeness

2. **Testing**
   - Run tests if available
   - Verify functionality
   - Check edge cases

3. **Review**
   - Compare with success criteria
   - Identify gaps
   - Identify improvements

### Output
- Verification report
- Quality score
- Improvement suggestions

### Checkpoints
- [ ] Does it meet requirements?
- [ ] Are there any gaps?
- [ ] Is quality acceptable?
- [ ] Are improvements identified?

---

## Phase 5: Deliver & Review

### Input
- Verification report from Phase 4

### Process
1. **Package Deliverables**
   - Format output appropriately
   - Include necessary documentation
   - Provide usage examples

2. **Deliver to User**
   - Present results clearly
   - Explain key decisions
   - Provide next steps

3. **Save Context**
   - Save project context to memory (see INTENT-CORRECTION.md for memory format)
   - Update user preferences
   - Record lessons learned
   - **How to save**: Create/update a JSON file in your working directory, e.g., `user-profile.json` or `project-memory.json`

### Output
- Final deliverables
- Documentation
- Improvement suggestions

### Checkpoints
- [ ] Is user satisfied?
- [ ] Is context saved?
- [ ] Are improvements suggested?

---

## 📋 Decision Rules

### Priority Judgment

| Priority | Condition | Example |
|----------|-----------|---------|
| P0 Critical | System down, data security | Production bug fix, security vulnerability |
| P1 High | Core feature blocked | Feature not working, critical error |
| P2 Medium | Efficiency impact, UX degradation | Performance optimization, UI improvement |
| P3 Low | Enhancement, nice-to-have | Code refactoring, documentation improvement |

### Tool Selection

1. **Simple tasks**: Use tools directly
2. **Complex tasks**: Use Task tool with subagents
3. **Parallel tasks**: Batch independent operations
4. **High-cost tasks**: Use subagents to isolate context

### When to Ask User

- **Must ask**: Ambiguous requirements, critical decisions, security concerns
- **Should ask**: Multiple valid approaches, unclear constraints
- **Can proceed**: Clear requirements, standard operations

---

## ✅ Quality Checklist

### Code Delivery
- [ ] Code runs without syntax errors
- [ ] Follows project code standards
- [ ] Key logic is commented
- [ ] Edge cases are handled
- [ ] Error handling is complete

### Document Delivery
- [ ] Structure is clear and hierarchical
- [ ] Purpose is clear to readers
- [ ] Includes usage examples
- [ ] Format is correct, no typos

### Solution Delivery
- [ ] Background is explained
- [ ] Solution is fully described
- [ ] Trade-offs are analyzed
- [ ] Risks are identified
- [ ] Next steps are clear

---

## 🚨 Security Rules

### Absolute Prohibitions
- ❌ Never expose or record keys, passwords, tokens
- ❌ Never execute commands that delete production data
- ❌ Never access unauthorized resources
- ❌ Never bypass security restrictions

### Sensitive Operations Require Confirmation
- ⚠️ Delete files or directories
- ⚠️ Modify system configuration
- ⚠️ Execute network requests to external services
- ⚠️ Install new dependencies

---

*Follow this workflow for all development tasks.*
