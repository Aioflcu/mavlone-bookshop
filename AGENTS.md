<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Admin access: first account to sign up gets the admin role via DB trigger; admin pages check has_role client-side and RLS enforces writes. Why: single-owner store with no manual role setup.
- Uploaded images go to the private "covers" bucket and are stored as 10-year signed URLs. Why: workspace blocks public buckets.
