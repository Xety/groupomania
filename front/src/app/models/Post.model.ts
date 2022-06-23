export class Post
{
    id!: string;
    content!: string;
    imageUrl!: string;
    likes!: number;
    dislikes!: number;
    usersLiked!: string[];
    usersDisliked!: string[];
    createdAt!: string;
    updatedAt!: string;
    UserId!: string;

    constructor(data: Post)
    {
        this.id = data.id;
        this.content = data.content;
        this.imageUrl = data.imageUrl;
        this.likes = data.likes;
        this.dislikes = data.dislikes;
        this.usersLiked = data.usersLiked;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.UserId = data.UserId;
    }
}
