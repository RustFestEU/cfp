### Version: v20210906.1
### Contributors:
### - flaki (flak.is)


## Information about the current language

-lang = en
-lang-name = English
-lang-name-english = English

## Terms, to be used as part of the translations only

-note-some-markdown = Some typographic markdown is allowed.
-note-most-markdown = Most markdown constructs are allowed (typography, lists, links etc.)
-note-no-markdown = No markdown allowed.
-note-editable = You will be able to change this before publishing.
-optional = optional

## CFP form global strings

f-title = RustFest Global 2021 CFP
f-form-notes = Filling out all fields is required, except for the ones explicitly marked as "optional".

## Submission deadline

f-submission-deadline-t = Submission deadline
f-submission-deadline =
    Note, the RustFest Global CFP has **no deadline**, the CFP *does not close*, but for your talk to be considered for one of our upcoming events, your submission should generally arrive 3-4 weeks before the event date.
    
    { "[" }See this link for cut-off dates for CFP submissions for upcoming events](
    { $linkUpcomingEvents }
    )

## Submission management

f-manage-t = Upload & manage proposals
f-manage = If you already have a proposal in a TOML format (exported from this page or another compatible conference) you can import the file here:
f-manage-upload-btn = Upload Proposal
f-manage-auth = You may also authenticate with your email address to manage your existing submissions:
f-manage-auth-btn = Send Code
f-manage-download-t = Download proposal
f-manage-download =
    Here you can download your proposal in a text format.
    This may come handy if you want to finish and submit your proposal later.
    
    Note that we will also send you your completed proposal via email after you have submitted and confirmed your submission below.
f-manage-download-btn = Download Proposal

## Submission detail fields

f-submission-t = Submission
f-submission-lang-t = Select the language for your submission
f-submission-lang =
    Select the language you will be writing your submission in.
    
    Changing the language above changes the language of the instructions on this page.
    We accept submissions in the provided languages and all CFP-commitee members who require it will receive translations for their evaluation.
    Writing your submission in any of these languages *will not affect* your chances for being selected to speak in any way, so feel free to choose the language you consider yourself to be most comfortable with.
    
    { "[" }Learn more about RustFest Global’s language support]({ $linkSupportedLanguages })
f-submission-presentation-lang-t = Presentation language
f-submission-presentation-lang =
    If you plan to present in { $submission_language_name } you can leave this field unmodified.
    
    If you would like to present in any other language than your submission, even if it’s not listed above you may let us know here.
    At RustFest we want to make it possible for everyone to present their ideas and showcase their work to the best of their ability, ensuring that these ideas reach a wide audience.
    For this reason we are always happy to host talks in a wide variety of languages, provided that we are able to sufficiently support them (i.e. in the form of subtitling).
    
    Feel free to propose multiple languages here (noting the order of your preference), and if accepted we will reach out to discuss the details.
    
    { "[" }Learn more about RustFest Global’s language support]({ $linkSupportedLanguages })
f-presentation-format-standard = standard talk
f-presentation-format-longform = longform talk
f-presentation-format-other = other
f-submission-presentation-format-t = Presentation format
f-submission-presentation-format-standard-t = { f-presentation-format-standard } (up to 25 min)
f-submission-presentation-format-longform-t = { f-presentation-format-longform } (up to 50 min)
f-submission-presentation-format-other-t = { f-presentation-format-other } (please explain in the “notes” section)
f-submission-presentation-format =
    We are primarily looking for talks, but if you have an idea for a non-talk contribution, feel free to share and if you convinced us we will be in touch to talk through the details.
    
    We are accepting standard (up to 25-minute) talks, as well as more in-depth “longform” talks for topics that require more time to expose — in this latter case make sure you touch on why your proposed talk requires more time in the proposal or the “notes” section.

## Proposal detail fields

f-proposal-t = The proposal
f-proposal-title-t = Title
f-proposal-summary-t = Summary
f-proposal-summary =
    A short description or summary of your session.
    You have up to 240 characters to pitch your proposed session, both for the CFP committee and the conference audience.
    
    The { f-proposal-title-t } & { f-proposal-summary-t } are the first things seen by the program selection committee, and will also be displayed in the event schedule listings and social media, so these are the most important venues for you to leave an impression both for talk selection and, once your proposal is accepted, for the conference attendees as well.
    
    _{ -note-some-markdown }_  
    _{ -note-editable }_
f-proposal-description-t = Description
f-proposal-description =
    A longer, more detailed description of the proposed session.
    
    For more information on how to structure your proposal, read our published [CFP Guidelines]({ $linkCfpGuidelines }).
    
    _{ -note-most-markdown }_  
    _{ -note-editable }_
f-proposal-audience-t = Audience
f-proposal-audience =
    What kind of audience does your session target?  
    Who will get the most out of your presentation?  
    Please choose an audience type that fits your proposal the best:
f-proposal-audience-beginner-friendly-t = **Introductory** -- beginner-friendly technical talks, some programming experience is recommended
f-proposal-audience-some-rust-t = **Basic Rust** -- some baseline knowledge of Rust or systems programming is recommended
f-proposal-audience-advanced-rust-t = **Advanced Rust** -- a solid knowledge of Rust and/or systems programming is recommended
f-proposal-audience-all-audiences-t = **Everyone** -- no programming experience required, a talk for all audiences
f-proposal-notes-t = Notes to the organizers ({ -optional })
f-proposal-notes =
    Here you may leave notes or remarks for the organizers and the selection committee.
    
    _{ -note-most-markdown }_

## Submitter information fields

f-submitter-t = About you
f-submitter-name-t = Name
f-submitter-tagline-t = Tagline
f-submitter-tagline =
    Title, tagline or organizational affiliation.  
    Here you may give a shoutout to your employer --- especially if they supported you during the preparation for your session --- or choose your own tagline or shoutout.  
    Some examples:
    
    - *“Software Engineer at Crab Corp.”*
    - *“Rust Compiler Magician”*
    - *“Embedded Rust Engineer, available for contract work”*
    
    Be sure to keep it short & sweet, as we will show this everywhere on the session info pages and on social media!
    
    _{ -note-no-markdown }_  
    _{ -note-editable }_
f-submitter-bio-t = Bio
f-submitter-bio =
    Tell us & the attendees more about yourself. This will be displayed on the session pages.
    
    _{ -note-most-markdown }_  
    _{ -note-editable }_
f-proposal-highlight-t = Suggested Edition
f-proposal-highlight =
    If you believe your proposal would be a great fit for an upcoming event, here you may highlight it for the organizers of that event.
    This may be useful when your proposal is better suited for that particular event than the others.
    
    Note that _this is just a recommendation_, regardless of your selection below all teams will have access to your proposal and may choose to include it in their program, so if you have no preference just leave this on the default value.
event-none = All
event-none-summary = This proposal should be a great fit for any of the upcoming events.

## Contact information fields

f-contact-t = Contact information
f-contact-email-t = Email address
f-contact-email =
    We will send you a confirmation of your received proposal.
    The teams will use your email to contact you about followups and notifications about the selection process.
    You will be able to edit, review the status of and retract your proposals by authenticating using this address.
