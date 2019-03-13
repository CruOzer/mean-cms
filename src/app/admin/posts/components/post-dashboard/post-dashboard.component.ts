import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../models/Post';
import { Subscription, Subject, Observable } from 'rxjs';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-post-dashboard',
  templateUrl: './post-dashboard.component.html',
  styleUrls: ['./post-dashboard.component.scss']
})
export class PostDashboardComponent
  implements OnInit, AfterViewInit, OnDestroy {
  pageSize: number = 5;
  isLoading = true;
  dataSource = new MatTableDataSource<Post>();
  displayedColumns: string[] = [
    'title',
    'creator',
    'categories',
    'tags',
    'date',
    'action'
  ];

  private updateListener: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private postService: PostsService) {}
  ngOnInit() {}

  ngAfterViewInit(): void {
    // Listen to PostService publishing new posts
    this.updateListener = this.postService
      .getPostUpdateListener()
      .subscribe((data: { posts: Post[]; postCount: number }) => {
        // Update  Data table
        this.dataSource.data = data.posts;
        this.paginator.length = data.postCount;
        this.isLoading = false;
      });

    // On Pagination fetch new posts
    this.paginator.page.subscribe(() => {
      console.log('On Change');

      this.isLoading = true;
      this.postService.getPosts(
        this.paginator.pageSize,
        this.paginator.pageIndex + 1
      );
    });

    // Inital get posts
    this.postService.getPosts(this.pageSize, 1);
  }

  ngOnDestroy(): void {
    this.updateListener.unsubscribe();
  }

  onDelete(id: string) {
    this.postService.deletePost(id);
  }
}
