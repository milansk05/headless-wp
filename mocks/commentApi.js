// commentApi.js - Mock implementatie voor comments en votes

// Simuleer een database met comments en votes
let commentsDb = [
    {
        id: '1',
        authorName: 'John Doe',
        content: 'Dit is een voorbeeld comment',
        date: new Date().toISOString(),
        voteScore: 5
    },
    {
        id: '2',
        authorName: 'Jane Smith',
        content: 'Nog een comment om te testen',
        date: new Date(Date.now() - 86400000).toISOString(), // 1 dag geleden
        voteScore: 2
    }
];

// Map om bij te houden wie (welk apparaat) op welk comment heeft gestemd
const deviceVotes = {};

/**
 * Formatteert comments voor frontend weergave
 */
export const getFormattedComments = () => {
    return commentsDb.map(comment => ({
        ...comment
    }));
};

/**
 * Haalt vote status op voor een specifieke device ID en comment
 */
export const getVoteStatus = (commentId, deviceId) => {
    const key = `${deviceId}_${commentId}`;
    return deviceVotes[key] || 'none';
};

/**
 * Registreert een vote voor een comment
 */
export const registerVote = (commentId, voteType, deviceId) => {
    const key = `${deviceId}_${commentId}`;
    const oldVote = deviceVotes[key] || 'none';

    // Vind het comment in de database
    const commentIndex = commentsDb.findIndex(c => c.id === commentId);
    if (commentIndex === -1) {
        return { success: false, message: 'Comment niet gevonden' };
    }

    const comment = commentsDb[commentIndex];

    // Bereken de nieuwe score
    let scoreDelta = 0;
    if (voteType === 'up') {
        scoreDelta = oldVote === 'down' ? 2 : (oldVote === 'up' ? 0 : 1);
    } else if (voteType === 'down') {
        scoreDelta = oldVote === 'up' ? -2 : (oldVote === 'down' ? 0 : -1);
    } else if (voteType === 'none') {
        scoreDelta = oldVote === 'up' ? -1 : (oldVote === 'down' ? 1 : 0);
    }

    // Update de database
    if (voteType === 'none') {
        delete deviceVotes[key];
    } else {
        deviceVotes[key] = voteType;
    }

    commentsDb[commentIndex] = {
        ...comment,
        voteScore: comment.voteScore + scoreDelta
    };

    return {
        success: true,
        commentId,
        voteCount: commentsDb[commentIndex].voteScore,
        userVote: voteType,
        message: 'Vote geregistreerd'
    };
};

/**
 * Voegt een nieuw comment toe
 */
export const addComment = (postId, name, email, content) => {
    const newComment = {
        id: String(Date.now()),
        authorName: name,
        content,
        date: new Date().toISOString(),
        voteScore: 0
    };

    commentsDb.push(newComment);

    return {
        success: true,
        comment: newComment,
        message: 'Comment toegevoegd'
    };
};