import admin from "firebase-admin";
// const require = createRequire(import.meta.url);
const serviceAccount = {
  type: "service_account",
  project_id: "brindavan-student-app",
  private_key_id: "0acd618b40da8bd2afcd4d2ecd44030c6eb7b113",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCOBhWCNdBrqI2m\nUbfoCb8SUFlO96BkqVN3PND6nWjC3T3qnoaR3vMHE1yOc4dWQ7Gui28FknMDGIAj\nsNgwru6UKYGILbNWlKyExUKyXC4R6X9ahaAwGDW16XnuT4febNmDANW+IiVXK+Sy\nqYFk1mQNxoNJDq3ogaUUnJxyzopm4UPfjLelci3VUwAEniRNtNnRZxozyCWv6PiL\nqNqkGdgZHjaS7zOyR0kBxjd9o2IkH2++JmuO1nebrK6mCSqx0C4xwsEWkNKl+Lee\nIVGAdxyjR1mL/JzW2wCxs5uMMtU96FHD7RtdiqF9hC71/zUSRv8In45R9aMLNtc+\nIlBubznVAgMBAAECggEAIm/hOUB5OBGXvzNjZ3UtinBHJ3mtv5q7LVdmyM3wQAfL\nYp9ru+UWgqm0MKpcr5Mce1k941j+YErJj13rHerc2LozuWRzbtP//PWj1YG6fgdj\nJPzvuZm1NFXXhexs4ob8OuKx8TdwXHG9M4Ecaen+OsTewpE3pAADmjrbSI9CSe2K\ntXQGDnqUSCaYBYrwRU9orFbDYEW69h2+KfO/RYwTtWLOiCHwAYItBeRZMB4tUqiR\nECSp8yo7EX7JTIJ05VhLK7JoWIcDxl5DbWl9fLrLz+Y1eiO8XhPLajJyJIKUM8GK\n/8MUbAbELnc0GE4bGLLnxQrtqNeOHPwXHpP1edSwZQKBgQDFDjqssZOVCjqw8jIq\nKYnmS59wSw2T/AayV6iN0yGJZk08uBwL4qOsPGxxEC8i0uDS2ae/lK6ANJXvHNOo\n3JdWlfegn98ymxSTYt+ADwCIIvZZEHF3+TDEQJV2xRRluYHIBd/sc29eLmbajPaQ\nWTxlY0ETpeowa/fJQ8gWVyh7AwKBgQC4gbn9o0tfrCqO9gVcbD95sElaDXDxn2GF\nRxe4U/gDaQJeq6n+LSMcy0HJUd5Ka2y5M7oZYZgJxbAJJxrGSVJqi7TlCSyJpNG3\nG/kqMDKzc/W77hSVjnujhz0Z42l+3Ug5NHDVz0v91w77p0txsLZvcHQSMBvlghF6\ne4DG1D20RwKBgBfgeoGUXsKPY78vCZ8MO3ZZMW+E2JdW0WTotDbDH2wrpi42TMev\n5Y8oHyewA1Yf4TgLQYU4OdC1DnnTr13lpLzMHR4sYPobyml1cIlux+y298yg7m7Q\nFfWhsbqbdLZCvRQEijZ3YkYyLypKLFIfTe8nEKqVzwOhAXw0p1j1pKULAoGBAI+5\nZhOA31cAewpv9I8hN3TocMs4SzG8sK+sSHrq1fh6FUF/wWTg7kggwPc80cbw1XmT\nJLVew5thJhaLIp0xQoUCnQAI3GvAOyjDHp3Re700aEhjVh+GJSOmVl9TObt8TiVZ\nh0fWOeDbZK19jRRbzlESrSf519E5N7pMeGzpqcNDAoGBAImB3ikd7HK7XN5STAMZ\n9C+KVdMIx++TJheAuiv4bLBlRnTebTN+QosRZImdoNjFaHswj6pjQRpCJYvS6vG0\n1pMJqU1fb1ES+YSXbqgX5Q2yGr5QyvUk91JkwqHxIlkIrsxJLXu5CVnLyg69Yy2Y\nOKO5nxmYJJ/76C4x5ztMVh5x\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-6zx3l@brindavan-student-app.iam.gserviceaccount.com",
  client_id: "106159149078907067556",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-6zx3l%40brindavan-student-app.iam.gserviceaccount.com",
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const adminFirestore = admin.firestore;
export const db = admin.firestore();
export const AdminAuth = admin.auth();
// admin.auth()
