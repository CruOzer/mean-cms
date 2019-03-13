import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from '../../models/Post';
import { PostsService } from '../../services/posts.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ServerMessage } from 'src/app/admin/models/ServerMessage';
import { ActivatedRoute, ParamMap } from '@angular/router';
//declare var $: any;

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss']
})
export class AddPostComponent implements OnInit {
  isLoading: boolean = false;
  editMode: Boolean;
  private postId: string;
  post: Post;

  constructor(
    private postService: PostsService,
    private route: ActivatedRoute,
    private flashMsg: FlashMessagesService
  ) {
    this.post = {
      title: null,
      content: null,
      categories: null,
      tags: null,
      allowComments: null,
      status: null,
      id: null
    };
  }

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.editMode = paramMap.has('postId');
      if (this.editMode) {
        this.postId = paramMap.get('postId');
        this.postService.getPost(this.postId).subscribe(
          (data: { message: string; post: Post }) => {
            console.log(data.post);

            this.post = data.post;
            this.isLoading = false;
          },
          (error: ServerMessage) => {
            this.isLoading = false;
            this.flashMsg.show('Error while getting post: ' + error.message, {
              cssClass: 'alert-danger',
              timeout: 4000
            });
          }
        );
      } else {
        this.post = {
          title: '',
          content: '',
          categories: '',
          tags: '',
          allowComments: true,
          status: null,
          id: null
        };
        this.isLoading = false;
      }
    });
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.isLoading = true;

    if (this.editMode) {
      this.editPost(form);
    } else {
      this.addPost(form);
    }
  }

  private editPost(form: NgForm) {
    this.post.title = form.value.title;
    this.post.content = form.value.body;
    this.post.categories = form.value.categories;
    this.post.tags = form.value.tags;
    this.post.allowComments =
      form.value.allowComments === '' ? false : form.value.allowComments;
    this.post.status = form.value.status;
    this.postService.updatePost(this.postId, this.post);
  }

  private addPost(form: NgForm) {
    const post: Post = {
      title: form.value.title,
      content: form.value.body,
      categories: form.value.categories,
      tags: form.value.tags,
      allowComments:
        form.value.allowComments === null ? false : form.value.allowComments,
      status: form.value.status,
      id: null
    };
    this.postService.createPost(post);
  }
}
