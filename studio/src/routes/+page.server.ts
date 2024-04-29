import { fetchSongLibrary, fetchSongURL } from '../api/audio.server';

export async function load() {
	return {
		songLibrary: await fetchSongLibrary(),
	};
}

/** @type {import('./$types').Actions} */
export const actions: import('./$types').Actions = {
	getSongURL: async ({ request }) => {
		const form = await request.formData();
		const songId = (form.get('songId') as string) || '';
		return {
			songURL: await fetchSongURL(songId),
		};
	}
	// updateProfile: profile,
	// updateOrgDetails: organization,
	// addMember: async ({ request, locals }) => {
	//     const form: any = await request.formData();
	//     const orgId = form.get("orgid");
	//     const addEmail = form.get("addEmail");
	//     const emails = addEmail.split(",");
	//     for (let i = 0; i < emails.length; i++) {
	//         const email = emails[i];
	//         const addMemberData = await updateOrgInviteMember(
	//             orgId,
	//             email.trim(),
	//             "member",
	//             locals.accessToken
	//         );
	//     }
	//     return {
	//         addMemberData: {
	//             status: 202,
	//         },
	//     };
	// },
	// changeRole: async ({ request, locals }) => {
	//     const form: any = await request.formData();
	//     const role = form.get("role");
	//     const roleEmail = form.get("roleEmail");
	//     const data = await updateOrgChangeRole(locals.orgId, roleEmail, role, locals.accessToken);
	//     return {
	//         ...data,
	//     };
	// },
	// removeMember: async ({ request, locals }) => {
	//     const form: any = await request.formData();
	//     const removeEmail = form.get("removeEmail");
	//     return {
	//         ...(await updateOrgRemoveMember(locals.orgId, removeEmail, locals.accessToken)),
	//     };
	// },
	// uninviteMember: async ({ request, locals }) => {
	//     const form: any = await request.formData();
	//     const uninviteEmail = form.get("uninviteEmail");
	//     return {
	//         ...(await updateOrgUninvite(locals.orgId, uninviteEmail, locals.accessToken)),
	//     };
	// },
	// createToken: async ({ request, locals }) => {
	//     const form: any = await request.formData();
	//     const name = form.get("name");
	//     return {
	//         newToken: await createAPIToken(name, locals.accessToken),
	//     };
	// },
	// deleteToken: async ({ request, locals }) => {
	//     const form: any = await request.formData();
	//     const deleteToken = form.get("deleteToken");
	//     return {
	//         removeToken: await deleteAPIToken(deleteToken, locals.accessToken),
	//     };
	// },
};
