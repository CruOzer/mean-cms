import { Injectable } from '@angular/core';
import { Post } from '../models/Post';
import { HttpClient } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ServerMessage } from '../../models/ServerMessage';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

const BACKEND_URL: string = environment.apiUrl + '/posts';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  constructor(
    private http: HttpClient,
    private flashMsg: FlashMessagesService,
    private router: Router
  ) {}

  postCount: number = 0;
  posts: Post[] = [];
  private postsUpdated: Subject<{
    posts: Post[];
    postCount: number;
  }> = new Subject<{ posts: Post[]; postCount: number }>();

  getPostUpdateListener(): Observable<{ posts: Post[]; postCount: number }> {
    return this.postsUpdated.asObservable();
  }

  getPosts(postPerPage: number, currentPage: number) {
    const queryParam: string = `?pagesize=${postPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: Post[]; maxPosts: number }>(
        BACKEND_URL + queryParam
      )
      .subscribe(
        (data: { message: string; posts: Post[]; maxPosts: number }) => {
          this.posts = data.posts;
          this.postCount = data.maxPosts;
          this.postsUpdated.next({
            posts: [...this.posts],
            postCount: this.postCount
          });
        },
        (error: ServerMessage) => {
          this.flashMsg.show('Error while getting posts: ' + error.message, {
            cssClass: 'alert-danger',
            timeout: 4000
          });
        }
      );
  }

  getPost(id: string): Observable<{ message: string; post: Post }> {
    return this.http.get<{ message: string; post: Post }>(
      BACKEND_URL + '/' + id
    );
  }

  createPost(post: Post) {
    this.http
      .post<{ message: string; post: Post }>(BACKEND_URL, post)
      .subscribe(
        response => {
          this.posts.push(post);
          this.postsUpdated.next({
            posts: [...this.posts],
            postCount: this.postCount
          });
          this.flashMsg.show(response.message, {
            cssClass: 'alert-success',
            timeout: 4000
          });
          this.router.navigate(['/admin/posts']);
        },
        (error: ServerMessage) => {
          this.flashMsg.show('Error while deleting posts: ' + error.message, {
            cssClass: 'alert-danger',
            timeout: 4000
          });
        }
      );
  }

  updatePost(id: string, post: Post) {
    this.http.put<{ message: string }>(BACKEND_URL + '/' + id, post).subscribe(
      response => {
        // Update the item
        this.posts.forEach((item, index) => {
          if (item.id === id) {
            this.posts[index] = post;
          }
        });
        this.router.navigate(['/admin/posts']);
        // Broadcaste update
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: this.postCount
        });
        this.flashMsg.show(response.message, {
          cssClass: 'alert-success',
          timeout: 4000
        });
      },
      (error: ServerMessage) => {
        this.flashMsg.show('Error while deleting posts: ' + error.message, {
          cssClass: 'alert-danger',
          timeout: 4000
        });
      }
    );
  }

  deletePost(id: string) {
    return this.http
      .delete<{ message: string }>(BACKEND_URL + '/' + id)
      .subscribe(
        response => {
          this.posts.forEach((item, index) => {
            if (item.id === id) {
              this.posts.splice(index, 1);
            }
          });
          // Broadcaste update
          this.postsUpdated.next({
            posts: [...this.posts],
            postCount: this.postCount - 1
          });
          this.flashMsg.show(response.message, {
            cssClass: 'alert-success',
            timeout: 4000
          });
        },
        (error: ServerMessage) => {
          this.flashMsg.show('Error while deleting posts: ' + error.message, {
            cssClass: 'alert-danger',
            timeout: 4000
          });
        }
      );
  }
}
