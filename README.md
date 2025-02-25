# Online Exam


# Git Flow
- Step 1: Change label of task to processing
- Step 2: checkout to dev, pull newest code from dev
    ```
    git checkout dev
    git pull origin dev
    ```
- Step 3: Create branch for task, base in branch `dev`

    **Rule of branch name:**

    - If issue have label is `'Task'`, branch name start with `task/`
    - If issue have label is `'Feature'`, branch name start with `feat/`
    - If issue have label is `'Bug'`, branch name start with `fix/`
    - After that, concat with string `kentei-[issueId]`

    Example: Issue is `Feature`, Id is `123`, Name is `Create Page login`. Branch name is `feat/exam-123`
    ```
    git checkout -b feat/kentei-123 dev
    ```
- Step 4: When commit, message of commit follow rule
    - If issue have label is `'Task'`, branch name start with `task: `
    - If issue have label is `'Feature'`, branch name start with `feat: `
    - If issue have label is `'Bug'`, branch name start with `fix: `
    - Next is string `[#[issueId]]`
    - Next is commit content

    Example: `feat: [#123] Coding layout for page login`
- Step 5: When create merge request
    
    **Rule of merge request name:**
    
    - If issue have label is `'Task'`, title start with `task: `
    - If issue have label is `'Feature'`, title start with `feat: `
    - If issue have label is `'Bug'`, title start with `fix: `
    - Start with `[#[issueId]]`
    - Next is  merge request content

        Example: `feat: [#123] Page login`

    **Rule of merge request description:**

    - In **`What does this MR do and why?`**, replace _`Describe in detail what your merge request does and why.`_ with your content of this merge request
    - In **`Screenshots or screen recordings`**, replace _`These are strongly recommended to assist reviewers and reduce the time to merge your change.`_ with screen recordings of feature or task for this merge request
    - Check the checklist
    - Select approver
    - Select merger

    **Rule fix conflict or merge newest code:**
    - Create other branch with convention like step 3. But have suffixes `-dev`, `-dev1`,... (in example, branch name is `feat/exam-123-dev`)
    - After that, merge coding branch to new branch. In example is merger branch `feat/exam-123` to branch `feat/exam-123-dev`
    - Create merge request to `dev`

Fix conflict and create merge request from feat/iam-123-dev to dev
