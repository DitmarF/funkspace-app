# FunkSpace mailbox cleanup — proposed operator guide

Prepared for Ditmar Funk on 2026-10-15 at
`fe2d0746c83486ee8d0d145fb00367868ae88f5a`. This is a manual procedure for the
existing Workspace inbox, not an implemented retention system. No labels, tasks,
notifications, filters or deletion settings have been applied by Codex. Dimi
reviews/adopts the procedure and checks reminders before relying on it.

The selected rule is unchanged: delete closed ordinary inquiries **six calendar
months after the conversation ends**, with documented justified exceptions.
The [operating guide](contact-operations.md#selected-mailbox-cleanup-policy)
owns that policy. Mail at `info@funkspace.de` and `dmarc@funkspace.de` shares the
existing user's inbox. DMARC reports are operational mail, not ordinary inquiries;
their retention period is not selected by this guide.

## The everyday workflow

| State                 | What Dimi does                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------- |
| Open inquiry          | Apply `FunkSpace/Open`; handle the conversation                                             |
| Conversation finished | Apply `FunkSpace/Closed`, remove Open, create one dated cleanup task                        |
| Conversation reopens  | Return to Open, remove Closed, delete the old cleanup task                                  |
| Deletion date arrives | Review, permanently delete the relevant mail and controlled copies, then delete its task    |
| Justified exception   | Apply `FunkSpace/Exception`; record a reason, necessary scope and next review/deletion date |

## Set up once — manually in Workspace Gmail

1. On a computer, open the Workspace inbox that owns the two aliases. Beside
   **Labels**, use **+** to create a parent label `FunkSpace` and nested labels
   `Open`, `Closed`, `Exception` and `DMARC`. If creating them by full name, the
   resulting labels must be `FunkSpace/Open` and so on.
2. Open the **Tasks** side panel and create a private list named
   `FunkSpace cleanup`. Confirm Tasks is available in the actual account.
3. Create a neutral trial task with a near-term date/time and confirm that its
   reminder is received on the device you use. Remove the trial task afterward.
   If reminders are unavailable/unreliable, resolve that before adopting this
   procedure; the guide does not claim a reminder has been tested.

[Gmail labels](https://support.google.com/mail/answer/118708?hl=en),
[Tasks availability](https://support.google.com/tasks/answer/7675772?hl=en),
[task dates and notifications](https://support.google.com/tasks/answer/7675838?co=GENIE.Platform%3DDesktop&hl=en).

Tasks adds limited private operator metadata within Google Workspace. Use neutral
IDs instead of copying inquiry content; remove the linked task when its mail is
deleted. This proposed use must be included in the account/privacy review before
claiming the procedure is operational. It creates no public form integration or
FunkSpace application scheduler and selects no paid service.

## Handle and close an inquiry

1. Label a genuine inquiry **Open**. Keep DMARC reports under **DMARC** rather
   than assigning inquiry deletion dates automatically from the recipient alias.
2. Treat an inquiry as closed when it is resolved and no reply/action is expected.
   Record that closure date; it is not necessarily the last received-message date.
3. Open its last relevant email and, at the top of Gmail, choose **Add to Tasks**
   (under the toolbar's More menu if needed). Move the task to **FunkSpace cleanup**
   and use a neutral title such as `Delete closed inquiry FS-001`. Replace any
   prefilled email subject with that neutral title; do not add visitor content.
4. Keep the email link. In the task details record only:

   ```text
   Closed: 2026-10-15
   Delete by: 2027-04-15
   ```

   Set the task's due date/time to that deletion day in the operator's local
   timezone, Europe/Berlin. Use an early enough reminder to act that day.
   Calculate six calendar months, not 180 days. If the target month lacks the
   original day number, use its last day; for example, 31 August closes with a
   deletion date on the last day of February.

5. Apply **Closed** and remove **Open**. Archive if helpful for inbox organization;
   archiving does not delete mail or change its due date.

[Create a task from email](https://support.google.com/mail/answer/9920317?co=GENIE.Platform%3DDesktop&hl=en),
[Gmail archive](https://support.google.com/mail/answer/6576?hl=en).

The date convention and closure procedure above are proposed for Dimi's adoption,
not an invented statutory retention rule. A task is a reminder, not automatic
deletion. Keep its title/details free of visitor names, addresses or message text.

## If the conversation reopens

Read new replies rather than relying on the old label. Return the inquiry to
**Open**, remove **Closed** and delete the obsolete cleanup task. After the
conversation is resolved again, create a new closure date and six-month task.
Gmail labels on existing messages do not automatically apply to new replies.
A different inquiry should have its own task rather than extending unrelated mail.
[Label behavior](https://support.google.com/mail/answer/118708?hl=en).

## On the deletion date

1. Open the linked conversation and check for later replies or a justified
   exception. Review related received/sent messages and attachments, including
   separate threads; only select material belonging to this inquiry.
2. If useful, search Gmail with narrow correspondent/subject terms and
   `in:anywhere` to include Spam and Trash. Review results before deleting.
   All Mail and Sent are views/labels, not automatically additional copies.
3. Delete the selected correspondence. In **Trash**, select only that inquiry's
   messages and choose **Delete forever** so Trash does not add up to 30 days.
   Leave unrelated mail alone.
4. Remove related drafts and any copies under your control in downloads,
   forwarding destinations, exports or local email clients, if present.
5. Delete the linked cleanup task, not just mark it complete. Do not keep its
   inquiry metadata indefinitely in completed tasks or a separate audit sheet.

[Gmail search](https://support.google.com/mail/answer/7190?hl=en),
[mail and Trash deletion](https://support.google.com/mail/answer/7401?hl=en),
[delete a task](https://support.google.com/tasks/answer/7675838?co=GENIE.Platform%3DDesktop&hl=en).

## Exceptions and routine review

For a specific justified exception, use **Exception** instead of ordinary Closed.
Record the reason, minimum material retained, owner Ditmar Funk and next review/
deletion date in the private task. Review on that date and remove what is no
longer justified. An unspecified “legal” reason is not an indefinite retention
instruction; do not invent a legal retention obligation.

Once a week, compare Closed inquiries with dated tasks, check unresolved Open
items and deal with missed/overdue tasks promptly. This catches setup mistakes;
it does not replace acting on each deletion date. Keep any long-term completion
summary anonymous, such as a monthly count, rather than retaining identifiers.

Do not use a blanket Gmail 180-day age rule as this procedure: it measures
message age, not Dimi's conversation-closure date. Google/provider backups and
administrator recovery can outlast removal from the visible mailbox; this guide
does not promise immediate erasure of every provider/correspondent copy.
[Admin auto-deletion](https://knowledge.workspace.google.com/admin/gmail/advanced/manage-email-storage-with-auto-delete-settings),
[Google retention](https://policies.google.com/technologies/retention?hl=en).

## Adoption checklist — pending

- [ ] Dimi adopts the closure/date/exception procedure.
- [ ] The FunkSpace parent and four nested Gmail labels, plus the private Tasks list, exist in the intended account.
- [ ] A harmless reminder trial works on the actual device.
- [ ] Forwarding, downloads, exports and local-client copies are inventoried.
- [ ] Account/privacy review covers the minimal Tasks metadata and its deletion.
- [ ] First real inquiry has a correct closure/deletion record when applicable.

DMARC publication, public legal-copy integration, recipient/fallback migration,
contact-form enabling, deployment, commit/push and FS-5.6 are outside this guide's
local preparation. The contact source lock remains false.
