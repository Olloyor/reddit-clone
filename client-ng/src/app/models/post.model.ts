export class PostModel {
    _id: string;
    name: string;
    url: string;
    description: string;
    voteCount: number;
    user: string;
    creatorName: string;
    commentCount: number;
    createdAt?: string;
    upVote?: boolean;
    downVote?: boolean;
}
