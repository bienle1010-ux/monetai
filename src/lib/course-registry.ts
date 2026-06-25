export interface Enrollment {
  courseId:    string;
  courseName:  string;
  enrolledAt:  string;
  price:       number;
  txCode?:     string;
  completedLessons: string[];   // lesson ids
  completedAt?: string;
}

export interface SubmittedCourse {
  id:          string;
  title:       string;
  description: string;
  category:    string;
  price:       number;
  level:       string;
  submittedAt: string;
  status:      "pending" | "active" | "rejected";
  instructorEmail: string;
}

const ENROLL_KEY  = (email: string) => `monetai_academy_enrollments_${email}`;
const SUBMIT_KEY  = (email: string) => `monetai_academy_submissions_${email}`;

function ls<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback; }
  catch { return fallback; }
}
function lsSet(key: string, val: unknown) {
  localStorage.setItem(key, JSON.stringify(val));
}

// ─── Enrollments ──────────────────────────────────────────────────────────────
export function getEnrollments(email: string): Enrollment[] {
  return ls<Enrollment[]>(ENROLL_KEY(email), []);
}

export function isEnrolled(email: string, courseId: string): boolean {
  return getEnrollments(email).some((e) => e.courseId === courseId);
}

export function enroll(email: string, e: Enrollment): void {
  const list = getEnrollments(email).filter((x) => x.courseId !== e.courseId);
  lsSet(ENROLL_KEY(email), [...list, e]);
}

export function markLessonComplete(email: string, courseId: string, lessonId: string): void {
  const list = getEnrollments(email);
  const idx  = list.findIndex((e) => e.courseId === courseId);
  if (idx < 0) return;
  const completed = list[idx].completedLessons ?? [];
  if (!completed.includes(lessonId)) completed.push(lessonId);
  list[idx].completedLessons = completed;
  lsSet(ENROLL_KEY(email), list);
}

export function courseProgress(email: string, courseId: string, totalLessons: number): number {
  const e = getEnrollments(email).find((x) => x.courseId === courseId);
  if (!e || totalLessons === 0) return 0;
  return Math.round((e.completedLessons.length / totalLessons) * 100);
}

// ─── Submitted courses ────────────────────────────────────────────────────────
export function getSubmissions(email: string): SubmittedCourse[] {
  return ls<SubmittedCourse[]>(SUBMIT_KEY(email), []);
}

export function submitCourse(
  email: string,
  c: Omit<SubmittedCourse, "id" | "submittedAt" | "status" | "instructorEmail">
): void {
  const list = getSubmissions(email);
  list.push({
    ...c,
    id:              "course-" + Date.now(),
    submittedAt:     new Date().toISOString(),
    status:          "pending",
    instructorEmail: email,
  });
  lsSet(SUBMIT_KEY(email), list);
}

// ─── VietQR ───────────────────────────────────────────────────────────────────
export function courseVietQRUrl(courseId: string, amount: number): string {
  const note = encodeURIComponent(`MONETAI ${courseId.slice(-8).toUpperCase()}`);
  return `https://api.vietqr.io/image/MB-0971166299-compact2.png?amount=${amount}&addInfo=${note}&accountName=MONET%20AI`;
}
