// simple base64 decode since I don't want to install more deps if not needed
function parseJwt(token) {
    try {
        return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    } catch (e) {
        return null;
    }
}

const url = "https://nmjgxptafvkgofrzrqxv.supabase.co";
const anon = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tamd4cHRhZnZrZ29mcnpycXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4OTg3ODUsImV4cCI6MjA4MTQ3NDc4NX0.Zof6IbTcfnE44SRQU5XlRFuQWnu8Dbvu40_t2yoWZPM";
const service = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTg5ODc4NSwiZXhwIjoyMDgxNDc0Nzg1fQ.Utde1eDywxbReacIQipCIfWuX_7mYUAmhdjbuuDoPmU";

console.log("Project ID from URL:", url.split('//')[1].split('.')[0]);

const anonClaims = parseJwt(anon);
console.log("Anon Token Ref:", anonClaims ? anonClaims.ref : "INVALID");
console.log("Anon Role:", anonClaims ? anonClaims.role : "INVALID");

const serviceClaims = parseJwt(service);
console.log("Service Token Ref:", serviceClaims ? serviceClaims.ref : "INVALID");
console.log("Service Role:", serviceClaims ? serviceClaims.role : "INVALID");
