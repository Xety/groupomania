export class Post
{
    id: string;
    content: string;
    imageUrl: string;
    likes: number;
    dislikes: number;
    usersLiked: Array<any>;
    usersDisliked: Array<any>; // Change type any
    createdAt: string;
    updatedAt: string;
    UserId: string;

    constructor(data: any)
    {
        this.id = data.id;
        this.content = data.content;
        this.imageUrl = data.imageUrl;
        this.likes = data.likes;
        this.dislikes = data.dislikes;
        this.usersLiked = data.usersLiked;
        this.usersDisliked = data.usersDisliked;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.UserId = data.UserId;
    }
}
