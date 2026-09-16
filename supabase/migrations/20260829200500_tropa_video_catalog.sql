insert into public.trop_videos
(video_id, video_type, section_code, source_name, display_order, youtube_url)
values
('VID-001','content','G00','VFIN_G00_V01',1,'https://youtu.be/rnjQbJBKL9g'),
('VID-002','content','G00','VFIN_G00_V02',2,'https://youtu.be/vrvoGRVEaRM'),
('VID-003','content','G00','VFIN_G00_V03',3,'https://youtu.be/cXf_tt6m7Sk'),
('VID-004','content','G00','VFIN_G00_V04',4,'https://youtu.be/IE6XyrRRq44'),

('VID-005','content','ABS','VFIN_ABS_V01',5,'https://youtu.be/B2Mx3OmKbvY'),
('VID-006','content','ABS','VFIN_ABS_V02',6,'https://youtu.be/sXwxMni-1As'),
('VID-007','content','ABS','VFIN_ABS_V03',7,'https://youtu.be/ZI3K7lh_IXw'),
('VID-008','content','ABS','VFIN_ABS_V04',8,'https://youtu.be/-d7rI8EBlGM'),

('VID-009','content','ESP','VFIN_ESP_V01',9,'https://youtu.be/gQuy4Qvciak'),
('VID-010','content','ESP','VFIN_ESP_V02',10,'https://youtu.be/oYppXadrOd0'),
('VID-011','content','ESP','VFIN_ESP_V03',11,'https://youtu.be/r7cPR_jhKWc'),
('VID-012','content','ESP','VFIN_ESP_V04',12,'https://youtu.be/paRI5YLGtPo'),

('VID-013','content','FIN','VFIN_FIN_V01',13,'https://youtu.be/KgzX73hNqxU'),
('VID-014','content','FIN','VFIN_FIN_V02',14,'https://youtu.be/dtjsMoOWc84'),
('VID-015','content','FIN','VFIN_FIN_V03',15,'https://youtu.be/Bs1M7K9fOnU'),
('VID-016','content','FIN','VFIN_FIN_V04',16,'https://youtu.be/So0Ftvmo8Bk'),

('VID-017','content','MEC','VFIN_MEC_V01',17,'https://youtu.be/3Ke2qkpJLfE'),
('VID-018','content','MEC','VFIN_MEC_V02',18,'https://youtu.be/oCy-6Ms_OnI'),
('VID-019','content','MEC','VFIN_MEC_V03',19,'https://youtu.be/YySmQpnKXX0'),
('VID-020','content','MEC','VFIN_MEC_V04',20,'https://youtu.be/Jfjv4BwfCEk'),

('VID-021','content','MEM','VFIN_MEM_V01',21,'https://youtu.be/jwpJOvXeKsQ'),
('VID-022','content','MEM','VFIN_MEM_V02',22,'https://youtu.be/gYVEvWcvWys'),
('VID-023','content','MEM','VFIN_MEM_V03',23,'https://youtu.be/O_hW2dU6k40'),
('VID-024','content','MEM','VFIN_MEM_V04',24,'https://youtu.be/N9H0WcIiiQQ'),

('VID-025','content','NUM','VFIN_NUM_V01',25,'https://youtu.be/N3qvZW34sWk'),
('VID-026','content','NUM','VFIN_NUM_V02',26,'https://youtu.be/840tfsl34QA'),
('VID-027','content','NUM','VFIN_NUM_V03',27,'https://youtu.be/ykxYxPPOiTk'),
('VID-028','content','NUM','VFIN_NUM_V04',28,'https://youtu.be/1WS9DqdWieE'),

('VID-029','content','PER','VFIN_PER_V01',29,'https://youtu.be/Y06I5znZITo'),
('VID-030','content','PER','VFIN_PER_V02',30,'https://youtu.be/WbHiW14wXBQ'),
('VID-031','content','PER','VFIN_PER_V03',31,'https://youtu.be/bWscxTH5da8'),
('VID-032','content','PER','VFIN_PER_V04',32,'https://youtu.be/wvt5LOuH-cI'),

('VID-033','content','VER','VFIN_VER_V01',33,'https://youtu.be/t4eoy3sqzwA'),
('VID-034','content','VER','VFIN_VER_V02',34,'https://youtu.be/quXA6QFJESo'),
('VID-035','content','VER','VFIN_VER_V03',35,'https://youtu.be/zvExttZH8Kk'),
('VID-036','content','VER','VFIN_VER_V04',36,'https://youtu.be/IblHOECMJQc'),

('VID-037','closing','CLOSING','VFIN_FIN_V01',37,'https://youtu.be/JEHz28u6lsw'),
('VID-038','closing','CLOSING','VFIN_FIN_V02',38,'https://youtu.be/1jDyCUQjGmI'),
('VID-039','closing','CLOSING','VFIN_FIN_V03',39,'https://youtu.be/8Em6WwYMJ0U'),

('WEL-001','welcome','WELCOME','VFIN_B01',1,'https://youtu.be/rdtwF9tSeUM'),
('WEL-002','welcome','WELCOME','VFIN_B02',2,'https://youtu.be/HdZFELKZQnQ'),
('WEL-003','welcome','WELCOME','VFIN_B03',3,'https://youtu.be/PRULJ5hJeDQ')
on conflict (video_id) do update
set video_type = excluded.video_type,
    section_code = excluded.section_code,
    source_name = excluded.source_name,
    display_order = excluded.display_order,
    youtube_url = excluded.youtube_url,
    updated_at = now();
