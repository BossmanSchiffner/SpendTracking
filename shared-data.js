import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, writeBatch } from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';
import { firebaseApp } from './firebase-config.js';

export const db = initializeFirestore(firebaseApp, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) });
const householdRef = id => doc(db, 'households', id);
const memberRef = (householdId, uid) => doc(db, 'households', householdId, 'members', uid);
const budgetRef = (householdId, budgetId) => doc(db, 'households', householdId, 'budgets', budgetId);
const idToken = () => crypto.randomUUID().replaceAll('-', '');

export async function createHousehold(name, user) {
  const id = crypto.randomUUID();
  const now = serverTimestamp();
  const displayName = (user.displayName || user.email || 'Owner').trim().slice(0, 80) || 'Owner';
  const batch = writeBatch(db);
  batch.set(householdRef(id), { name: name.trim(), ownerUid: user.uid, currency: 'CAD', timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC', schemaVersion: 1, createdAt: now, updatedAt: now });
  batch.set(memberRef(id, user.uid), { uid: user.uid, displayName, role: 'owner', joinedAt: now });
  await batch.commit();
  localStorage.setItem('shared-household-id', id);
  return id;
}
export async function getHousehold(id) { return (await getDoc(householdRef(id))).data() || null; }
export function watchHousehold(id, callback, error) { return onSnapshot(householdRef(id), snapshot => callback(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null), error); }
export function watchBudgets(householdId, callback, error) { const q = query(collection(db, 'households', householdId, 'budgets'), orderBy('createdAt', 'desc')); return onSnapshot(q, snapshot => callback(snapshot.docs.map(item => ({ id: item.id, ...item.data() }))), error); }
export async function saveBudget(householdId, budgetId, data, user) { const ref = budgetId ? budgetRef(householdId, budgetId) : doc(collection(db, 'households', householdId, 'budgets')); const payload = { name: data.name, amountCents: Number(data.amountCents), currency: data.currency || 'CAD', cadence: data.cadence, active: data.active !== false, updatedAt: serverTimestamp() }; if (data.anchorDate) payload.anchorDate = data.anchorDate; if (data.customDays !== undefined) payload.customDays = Number(data.customDays); if (!budgetId) Object.assign(payload, { createdAt: serverTimestamp(), createdByUid: user.uid }); await setDoc(ref, payload, { merge: true }); return ref.id; }
export const archiveBudget = (householdId, budgetId) => updateDoc(budgetRef(householdId, budgetId), { active: false, updatedAt: serverTimestamp() });
export function watchTransactions(householdId, budgetId, callback, error) { const q = query(collection(db, 'households', householdId, 'budgets', budgetId, 'transactions'), orderBy('transactionDate', 'desc')); return onSnapshot(q, snapshot => callback(snapshot.docs.map(item => ({ id: item.id, ...item.data() }))), error); }
export async function saveTransaction(householdId, budgetId, transactionId, data, user) { const ref = transactionId ? doc(db, 'households', householdId, 'budgets', budgetId, 'transactions', transactionId) : doc(collection(db, 'households', householdId, 'budgets', budgetId, 'transactions')); const displayName = (user.displayName || user.email || 'Member').trim().slice(0, 80) || 'Member'; const payload = { ...data, amountCents: Number(data.amountCents), updatedAt: serverTimestamp() }; if (!transactionId) Object.assign(payload, { createdAt: serverTimestamp(), createdByUid: user.uid, createdByDisplayName: displayName }); else payload.updatedByUid = user.uid; await setDoc(ref, payload, { merge: true }); return ref.id; }
export const deleteTransaction = (householdId, budgetId, transactionId) => deleteDoc(doc(db, 'households', householdId, 'budgets', budgetId, 'transactions', transactionId));
export async function createInvite(householdId, household, user) { const token = idToken(); await setDoc(doc(db, 'invites', token), { householdId, householdName: household.name, createdByUid: user.uid, createdAt: serverTimestamp(), expiresAt: new Date(Date.now() + 7 * 86400000), active: true }); return `${location.origin}${location.pathname}?invite=${token}`; }
export async function acceptInvite(token, user) { const ref = doc(db, 'invites', token), snapshot = await getDoc(ref); if (!snapshot.exists()) throw Error('This invite is missing or expired.'); const invite = snapshot.data(); if (!invite.active || invite.expiresAt?.toMillis?.() <= Date.now()) throw Error('This invite has expired or was revoked.'); const displayName = (user.displayName || user.email || 'Member').trim().slice(0, 80) || 'Member'; await setDoc(memberRef(invite.householdId, user.uid), { uid: user.uid, displayName, role: 'member', joinedAt: serverTimestamp(), inviteToken: token }); localStorage.setItem('shared-household-id', invite.householdId); return invite.householdId; }
export const revokeInvite = token => updateDoc(doc(db, 'invites', token), { active: false, updatedAt: serverTimestamp() });
