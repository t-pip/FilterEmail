
 var contactnames = ["z_Recruitment_Filter", "z_Stuff_Filter"];
 
function setContactName() {
 const z_contactname = contactnames;
 z_contactname.forEach(setLabelName);
}

function setLabelName(z_contact) {
  let out_contactName="";
  let out_labelName="";
  if (z_contact==="z_Recruitment_Filter") {
    out_contactName="z_Recruitment_Filter";
    out_labelName="Recruitment";
    } else if (z_contact==="z_Stuff_Filter"){
      out_contactName="z_Stuff_Filter";
      out_labelName="Stuff"
    }
    else{}

    updateGmailFilterForContact(out_contactName, out_labelName);
}

function updateGmailFilterForContact(email, labelName) {
  const response = People.People.searchContacts({
    query: email,
    readMask: "emailAddresses"
  });

  const people = response.results || [];

  if (people.length === 0) {
    Logger.log(`No contacts found for: ${email}`);
    return;
  }

  const emails = [];
  people.forEach(person => {
    const emailAddresses = person.person.emailAddresses || [];
    emailAddresses.forEach(e => {
      emails.push(e.value);
    });
  });

  if (emails.length === 0) {
    Logger.log(`No email addresses found for: ${email}`);
    return;
  }

  const filterFrom = emails.join(" OR ");
  const label = GmailApp.getUserLabelByName(labelName) || GmailApp.createLabel(labelName);
  const threads = GmailApp.search(`from:(${filterFrom}) in:(inbox) is:(unread)`);

  threads.forEach(thread => {
    thread.addLabel(label);
    thread.markRead();
    thread.moveToArchive();
  });

  Logger.log(`Processed ${threads.length} threads from ${email}`);
}