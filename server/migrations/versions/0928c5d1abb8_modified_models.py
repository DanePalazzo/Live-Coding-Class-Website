"""modified models

Revision ID: 0928c5d1abb8
Revises: 0d37ea1247be
Create Date: 2023-12-13 14:11:25.961038

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0928c5d1abb8'
down_revision = '0d37ea1247be'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('chat_messages', schema=None) as batch_op:
        batch_op.drop_constraint('fk_chat_messages_user_id_users', type_='foreignkey')
        batch_op.drop_constraint('fk_chat_messages_session_id_sessions', type_='foreignkey')
        batch_op.create_foreign_key(batch_op.f('fk_chat_messages_user_id_users'), 'users', ['user_id'], ['id'], ondelete='SET NULL')
        batch_op.create_foreign_key(batch_op.f('fk_chat_messages_session_id_sessions'), 'sessions', ['session_id'], ['id'], ondelete='SET NULL')

    with op.batch_alter_table('courses', schema=None) as batch_op:
        batch_op.drop_constraint('fk_courses_instructor_id_users', type_='foreignkey')
        batch_op.create_foreign_key(batch_op.f('fk_courses_instructor_id_users'), 'users', ['instructor_id'], ['id'], ondelete='SET NULL')

    with op.batch_alter_table('document_edits_history', schema=None) as batch_op:
        batch_op.drop_constraint('fk_document_edits_history_user_id_users', type_='foreignkey')
        batch_op.create_foreign_key(batch_op.f('fk_document_edits_history_user_id_users'), 'users', ['user_id'], ['id'], ondelete='SET NULL')

    with op.batch_alter_table('documents', schema=None) as batch_op:
        batch_op.drop_constraint('fk_documents_owner_id_users', type_='foreignkey')
        batch_op.drop_constraint('fk_documents_session_id_sessions', type_='foreignkey')
        batch_op.create_foreign_key(batch_op.f('fk_documents_owner_id_users'), 'users', ['owner_id'], ['id'], ondelete='SET NULL')
        batch_op.create_foreign_key(batch_op.f('fk_documents_session_id_sessions'), 'sessions', ['session_id'], ['id'], ondelete='SET NULL')

    with op.batch_alter_table('enrollments', schema=None) as batch_op:
        batch_op.drop_constraint('fk_enrollments_course_id_courses', type_='foreignkey')
        batch_op.create_foreign_key(batch_op.f('fk_enrollments_course_id_courses'), 'courses', ['course_id'], ['id'], ondelete='SET NULL')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('enrollments', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_enrollments_course_id_courses'), type_='foreignkey')
        batch_op.create_foreign_key('fk_enrollments_course_id_courses', 'courses', ['course_id'], ['id'])

    with op.batch_alter_table('documents', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_documents_session_id_sessions'), type_='foreignkey')
        batch_op.drop_constraint(batch_op.f('fk_documents_owner_id_users'), type_='foreignkey')
        batch_op.create_foreign_key('fk_documents_session_id_sessions', 'sessions', ['session_id'], ['id'])
        batch_op.create_foreign_key('fk_documents_owner_id_users', 'users', ['owner_id'], ['id'])

    with op.batch_alter_table('document_edits_history', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_document_edits_history_user_id_users'), type_='foreignkey')
        batch_op.create_foreign_key('fk_document_edits_history_user_id_users', 'users', ['user_id'], ['id'])

    with op.batch_alter_table('courses', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_courses_instructor_id_users'), type_='foreignkey')
        batch_op.create_foreign_key('fk_courses_instructor_id_users', 'users', ['instructor_id'], ['id'])

    with op.batch_alter_table('chat_messages', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_chat_messages_session_id_sessions'), type_='foreignkey')
        batch_op.drop_constraint(batch_op.f('fk_chat_messages_user_id_users'), type_='foreignkey')
        batch_op.create_foreign_key('fk_chat_messages_session_id_sessions', 'sessions', ['session_id'], ['id'])
        batch_op.create_foreign_key('fk_chat_messages_user_id_users', 'users', ['user_id'], ['id'])

    # ### end Alembic commands ###